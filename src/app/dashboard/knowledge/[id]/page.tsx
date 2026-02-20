'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUploader } from '@/components/knowledge/FileUploader'
import { toast } from 'sonner'
import { ArrowLeft, BookOpen, FileText, Trash2, RefreshCw, Search, Loader2 } from 'lucide-react'

interface KnowledgeFile {
  id: string
  filename: string
  file_type: string
  file_size_bytes: number
  processing_status: string
  created_at: string
}

export default function KnowledgeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const knowledgeId = params.id as string

  const [knowledgeBase, setKnowledgeBase] = useState<any>(null)
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [loading, setLoading] = useState(true)
  const [testQuery, setTestQuery] = useState('')
  const [testResults, setTestResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: kb } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('id', knowledgeId)
        .eq('user_id', user.id)
        .single()

      if (!kb) {
        toast.error('知识库不存在')
        router.push('/dashboard/knowledge')
        return
      }

      setKnowledgeBase(kb)

      const { data: kbFiles } = await supabase
        .from('knowledge_files')
        .select('*')
        .eq('knowledge_base_id', knowledgeId)
        .order('created_at', { ascending: false })

      setFiles(kbFiles || [])
      setLoading(false)
    }

    fetchData()
  }, [knowledgeId, router, supabase])

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('确定要删除这个文件吗？')) return

    const { error } = await supabase
      .from('knowledge_files')
      .delete()
      .eq('id', fileId)

    if (error) {
      toast.error('删除失败')
      return
    }

    setFiles(files.filter(f => f.id !== fileId))
    toast.success('文件已删除')
  }

  const handleUploadComplete = () => {
    window.location.reload()
  }

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return

    setTesting(true)
    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledge_base_id: knowledgeId,
          query: testQuery,
        }),
      })

      const data = await response.json()
      
      if (data.results) {
        setTestResults(data.results)
      } else {
        setTestResults([])
      }
    } catch {
      toast.error('搜索失败')
    } finally {
      setTesting(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
    }
    const labels: Record<string, string> = {
      pending: '等待中',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/knowledge')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">{knowledgeBase?.name}</h1>
          {knowledgeBase?.description && (
            <p className="text-slate-400">{knowledgeBase.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>文件管理</span>
              <span className="text-sm text-slate-400 font-normal">
                {files.length} 个文件
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              knowledgeBaseId={knowledgeId}
              onUploadComplete={handleUploadComplete}
            />

            {files.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate">{file.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{formatSize(file.file_size_bytes)}</span>
                          {getStatusBadge(file.processing_status)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-400"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">知识库测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm">
              输入问题测试知识库检索效果
            </p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestSearch()}
                placeholder="输入问题..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={handleTestSearch}
                disabled={testing || !testQuery.trim()}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm text-slate-400">检索结果：</p>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg"
                  >
                    <p className="text-white text-sm">{result.content}</p>
                    {result.score && (
                      <p className="text-xs text-slate-500 mt-1">
                        相关度: {(result.score * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {testQuery && testResults.length === 0 && !testing && (
              <p className="text-slate-400 text-sm">暂无检索结果</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
