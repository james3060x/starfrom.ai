/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, FileText, Trash2, RefreshCw, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface KnowledgeBase {
  id: string
  name: string
  description: string | null
  total_files: number
  total_chunks: number
  total_size_bytes: number
  created_at: string
}

export default function KnowledgePage() {
  const router = useRouter()
  const supabase = createClient()
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data }: any = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setKnowledgeBases(data || [])
      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个知识库吗？')) return

    const { error } = await supabase
      .from('knowledge_bases')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('删除失败')
      return
    }

    setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== id))
    toast.success('知识库已删除')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">知识库</h1>
          <p className="text-slate-400">管理你的知识库和文档</p>
        </div>

        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          创建知识库
        </Button>
      </div>

      {knowledgeBases.length === 0 ? (
        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">还没有知识库</h3>
            <p className="text-slate-400 mb-6 text-center">
              创建知识库来存储文档<br />
              让你的 Agent 基于知识库回答问题
            </p>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              创建第一个知识库
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeBases.map((kb) => (
            <Card key={kb.id} className="bg-slate-900/50 border-white/5 hover:border-white/10 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">{kb.name}</CardTitle>
                      {kb.description && (
                        <p className="text-xs text-slate-400 mt-1">{kb.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {kb.total_files} 文件
                  </span>
                  <span>{formatSize(kb.total_size_bytes)}</span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <Button variant="outline" size="sm" className="flex-1 border-white/10 text-white hover:bg-white/5">
                    <Upload className="w-3 h-3 mr-1" />
                    上传
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-400"
                    onClick={() => handleDelete(kb.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
