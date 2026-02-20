'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploaderProps {
  knowledgeBaseId: string
  onUploadComplete?: () => void
}

interface UploadFile {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.docx']

export function FileUploader({ knowledgeBaseId, onUploadComplete }: FileUploaderProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `不支持的文件类型: ${extension}`
    }
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
      return `不支持的文件类型`
    }
    if (file.size > 10 * 1024 * 1024) {
      return '文件大小不能超过 10MB'
    }
    return null
  }

  const handleFiles = async (selectedFiles: FileList | File[]) => {
    const newFiles: UploadFile[] = []

    for (const file of Array.from(selectedFiles)) {
      const error = validateFile(file)
      const uploadFileItem: UploadFile = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
      }
      newFiles.push(uploadFileItem)
    }

    setFiles(prev => [...prev, ...newFiles])

    const validFiles = newFiles.filter(f => f.status === 'pending')
    for (const fileData of validFiles) {
      await uploadSingleFile(fileData)
    }
  }

  const uploadSingleFile = async (fileData: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'uploading', progress: 0 } : f
    ))

    try {
      const file = Array.from((fileInputRef.current?.files || [])).find(f => f.name === fileData.name)
      if (!file) {
        throw new Error('文件未找到')
      }

      const timestamp = Date.now()
      const filePath = `${knowledgeBaseId}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, progress: 50 } : f
      ))

      const fileExt = file.name.split('.').pop() || 'unknown'

      const { error: dbError } = await supabase
        .from('knowledge_files')
        .insert({
          knowledge_base_id: knowledgeBaseId,
          filename: fileData.name,
          file_type: fileExt,
          file_size_bytes: fileData.size,
          storage_path: uploadData.path,
          processing_status: 'pending',
        })

      if (dbError) throw dbError

      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'success', progress: 100 } : f
      ))

      const { data: kb } = await supabase
        .from('knowledge_bases')
        .select('total_files, total_size_bytes')
        .eq('id', knowledgeBaseId)
        .single()

      if (kb) {
        await supabase
          .from('knowledge_bases')
          .update({
            total_files: (kb.total_files || 0) + 1,
            total_size_bytes: (kb.total_size_bytes || 0) + fileData.size,
          })
          .eq('id', knowledgeBaseId)
      }

      onUploadComplete?.()

    } catch (error: any) {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'error', error: error.message } : f
      ))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-white mb-2">
          拖拽文件到这里，或点击选择文件
        </p>
        <p className="text-slate-400 text-sm">
          支持 PDF、TXT、MD、DOCX，最大 10MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
            >
              <File className="w-8 h-8 text-slate-400" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2">
                    {file.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="flex-1 h-1" />
                  )}
                  {file.error && (
                    <span className="text-xs text-red-400">{file.error}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
