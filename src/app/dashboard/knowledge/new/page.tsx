'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'

const TEMPLATE_KBS = [
  {
    name: '产品文档',
    description: '产品使用说明、功能介绍、常见问题',
  },
  {
    name: '技术文档',
    description: 'API 文档、技术规范、开发指南',
  },
  {
    name: '客服知识库',
    description: '客服话术、退换货政策、服务条款',
  },
  {
    name: '公司知识库',
    description: '公司介绍、规章制度、员工手册',
  },
]

export default function NewKnowledgePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chunkSize: 1000,
    chunkOverlap: 100,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入知识库名称'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('请先登录')
        router.push('/auth/login')
        return
      }

      const { data: kb, error } = await supabase
        .from('knowledge_bases')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          chunk_size: formData.chunkSize,
          chunk_overlap: formData.chunkOverlap,
        })
        .select()
        .single()

      if (error) {
        toast.error('创建失败: ' + error.message)
        return
      }

      toast.success('知识库创建成功！')
      router.push(`/dashboard/knowledge/${kb.id}`)
    } catch (error) {
      toast.error('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = (template: typeof TEMPLATE_KBS[0]) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
    }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/knowledge"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回知识库
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">创建知识库</h1>
        <p className="text-slate-400">为你的 Agent 创建一个知识库</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例如：产品文档"
                className="bg-white/5 border-white/10 text-white"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简单描述这个知识库的用途"
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">向量化配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">切片大小</Label>
                <Input
                  type="number"
                  value={formData.chunkSize}
                  onChange={(e) => setFormData({ ...formData, chunkSize: parseInt(e.target.value) })}
                  min={100}
                  max={2000}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-slate-500">每个文档片段的字符数</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">切片重叠</Label>
                <Input
                  type="number"
                  value={formData.chunkOverlap}
                  onChange={(e) => setFormData({ ...formData, chunkOverlap: parseInt(e.target.value) })}
                  min={0}
                  max={200}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-slate-500">相邻片段的重叠字符数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">使用模板快速创建</p>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATE_KBS.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="p-3 rounded-lg border border-white/10 hover:border-cyan-500/30 bg-white/5 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{template.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/dashboard/knowledge" className="flex-1">
            <Button type="button" variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              取消
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1 bg-cyan-500 hover:bg-cyan-600"
            disabled={loading}
          >
            {loading ? '创建中...' : '创建知识库'}
          </Button>
        </div>
      </form>
    </div>
  )
}
