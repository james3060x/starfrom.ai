'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { ArrowLeft, Bot, Sparkles } from 'lucide-react'
import Link from 'next/link'

const MODEL_OPTIONS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (推荐)', description: '性价比高，速度快' },
  { value: 'gpt-4o', label: 'GPT-4o', description: '最新最强模型' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', description: '优秀的推理能力' },
]

const EMOJI_OPTIONS = ['🤖', '💬', '📚', '🎯', '🚀', '💡', '🔧', '📊', '🎨', '✨', '🧠', '🤝']

const TEMPLATE_PROMPTS = {
  '客服助手': `你是一位专业、友好的客服代表。你的职责是：
1. 热情接待来访客户
2. 了解客户需求并提供帮助
3. 如遇到无法解决的问题，礼貌地引导客户联系人工客服
4. 保持专业、耐心的态度
5. 适时推荐相关产品或服务`,

  '知识库问答': `你是一位知识渊博的助手。你的职责是：
1. 基于提供的知识库内容回答用户问题
2. 如果知识库中没有相关信息，明确告知用户
3. 回答要准确、简洁、有条理
4. 引用相关的参考来源`,

  '内容生成': `你是一位创意无限的内容营销专家。你的职责是：
1. 根据用户需求生成高质量的营销内容
2. 内容风格要符合品牌调性
3. 包括标题、正文、行动号召等完整结构
4. 善用故事和情感来打动读者`,
}

export default function NewAgentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🤖',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: '',
    enableWebSearch: false,
    enableFunctionCalling: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入 Agent 名称'
    } else if (formData.name.length > 50) {
      newErrors.name = '名称不能超过 50 个字符'
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = '请输入系统提示词'
    } else if (formData.systemPrompt.length > 2000) {
      newErrors.systemPrompt = '提示词不能超过 2000 个字符'
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

      const { data: soloUser } = await supabase
        .from('solo_users')
        .select('agent_limit')
        .eq('user_id', user.id)
        .single()

      const { data: existingAgents } = await supabase
        .from('user_agents')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      const agentLimit = soloUser?.agent_limit || 1
      if ((existingAgents?.length || 0) >= agentLimit) {
        toast.error('已达到 Agent 数量上限')
        router.push('/dashboard/agents')
        return
      }

      const { data: agent, error } = await supabase
        .from('user_agents')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon,
          model: formData.model,
          temperature: formData.temperature,
          max_tokens: formData.maxTokens,
          system_prompt: formData.systemPrompt.trim(),
          enable_web_search: formData.enableWebSearch,
          enable_function_calling: formData.enableFunctionCalling,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        toast.error('创建失败: ' + error.message)
        return
      }

      await supabase
        .from('solo_users')
        .update({ total_agents: (existingAgents?.length || 0) + 1 })
        .eq('user_id', user.id)

      toast.success('Agent 创建成功！')
      router.push('/dashboard/agents')
    } catch (error) {
      toast.error('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = (templateName: string) => {
    setFormData(prev => ({
      ...prev,
      systemPrompt: TEMPLATE_PROMPTS[templateName as keyof typeof TEMPLATE_PROMPTS] || '',
    }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回 Agents
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">创建新 Agent</h1>
        <p className="text-slate-400">配置你的 AI 智能体</p>
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
                placeholder="例如：客服助手"
                className="bg-white/5 border-white/10 text-white"
                maxLength={50}
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">描述</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简单描述这个 Agent 的用途"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">图标</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-10 h-10 text-xl rounded-lg transition-all ${
                      formData.icon === emoji
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">模型配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">模型</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MODEL_OPTIONS.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, model: model.value })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      formData.model === model.value
                        ? 'bg-cyan-500/10 border-cyan-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-white text-sm">{model.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Temperature: {formData.temperature}
              </Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                min={0}
                max={1}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>精确</span>
                <span>创意</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Max Tokens: {formData.maxTokens}
              </Label>
              <Slider
                value={[formData.maxTokens]}
                onValueChange={([value]) => setFormData({ ...formData, maxTokens: value })}
                min={100}
                max={4000}
                step={100}
                className="py-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">系统提示词 *</CardTitle>
            <CardDescription className="text-slate-400">
              定义 Agent 的行为方式和角色
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.keys(TEMPLATE_PROMPTS).map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  {template}
                </button>
              ))}
            </div>

            <Textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="输入系统提示词，定义 Agent 的行为..."
              className="min-h-[200px] bg-white/5 border-white/10 text-white"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-slate-500">
              {errors.systemPrompt && <span className="text-red-400">{errors.systemPrompt}</span>}
              <span>{formData.systemPrompt.length} / 2000</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/dashboard/agents" className="flex-1">
            <Button type="button" variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              取消
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1 bg-cyan-500 hover:bg-cyan-600"
            disabled={loading}
          >
            {loading ? '创建中...' : '创建 Agent'}
          </Button>
        </div>
      </form>
    </div>
  )
}
