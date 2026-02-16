'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User } from 'lucide-react'
import { toast } from 'sonner'

const scenarios = [
  {
    id: 'customer-service',
    title: '智能客服',
    description: '电商售前客服场景',
    icon: '🛍️',
    systemPrompt: '你是一位专业的电商客服，帮助客户了解产品信息、解答购买疑问。'
  },
  {
    id: 'knowledge-base',
    title: '知识库问答',
    description: '技术文档助手场景',
    icon: '📚',
    systemPrompt: '你是一位技术文档助手，帮助用户查找和理解技术文档内容。'
  },
  {
    id: 'content-generation',
    title: '内容生成',
    description: '营销文案助手场景',
    icon: '✍️',
    systemPrompt: '你是一位营销文案专家，帮助用户创作吸引人的营销内容。'
  }
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function DemoChat() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0])
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的 AI 助手。我可以帮助你解答问题，有什么可以帮你的吗？' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (turnCount >= 10) {
      toast.info('已达到演示对话限制')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    setTurnCount(prev => prev + 1)

    try {
      const response = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          scenario: selectedScenario.id,
          history: messages.slice(-4)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回答这个问题。请稍后再试。' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，服务暂时不可用。' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    setSelectedScenario(scenario)
    setMessages([
      { role: 'assistant', content: `你好！我是${scenario.title}助手。${scenario.description}，有什么可以帮你的吗？` }
    ])
    setTurnCount(0)
  }

  const isLimitReached = turnCount >= 10

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all ${
              selectedScenario.id === scenario.id
                ? 'border-[#06b6d4] bg-[#06b6d4]/5'
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleScenarioChange(scenario)}
          >
            <CardContent className="p-4">
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
              <p className="text-sm text-gray-500">{scenario.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-[#06b6d4] to-[#1e3a5f]" />
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-[#1e3a5f]'
                    : 'bg-[#06b6d4]'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#1e3a5f] text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#06b6d4] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isLimitReached ? (
            <div className="p-4 border-t bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73]">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="font-semibold">这就是基础模块的效果 ✨</p>
                  <p className="text-sm text-gray-300">想要定制专属版本？</p>
                </div>
                <a href="/contact">
                  <Button className="bg-[#06b6d4] hover:bg-[#0891b2]">
                    联系我们
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="输入消息..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#06b6d4] hover:bg-[#0891b2]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="px-4 pb-4 text-center">
            <p className="text-xs text-gray-400">
              Demo 使用 DeepSeek 模型，实际交付可根据需求选择不同模型
              {turnCount > 0 && ` · 剩余对话次数: ${10 - turnCount}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
