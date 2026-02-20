'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Send, Bot, User, Settings, Copy, RefreshCw, Plus, MessageSquare } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string | null
  created_at: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const agentId = params.agentId as string

  const [agent, setAgent] = useState<{
    id: string
    name: string
    description: string | null
    icon: string
    model: string
  } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: agentData } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user.id)
        .single()

      if (!agentData) {
        toast.error('Agent 不存在')
        router.push('/dashboard/agents')
        return
      }

      setAgent(agentData)

      const { data: convs } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('agent_id', agentId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setConversations(convs || [])

      if (convs && convs.length > 0) {
        setCurrentConversationId(convs[0].id)
        await loadMessages(convs[0].id)
      }
    }

    fetchData()
  }, [agentId, router, supabase])

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', conversationId)
      .order('created_at', { ascending: true })

    setMessages(data || [])
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: conv, error } = await supabase
      .from('user_conversations')
      .insert({
        agent_id: agentId,
        user_id: user.id,
        title: null,
      })
      .select()
      .single()

    if (error) {
      toast.error('创建会话失败')
      return
    }

    setConversations([conv, ...conversations])
    setCurrentConversationId(conv.id)
    setMessages([])
  }

  const handleSelectConversation = async (convId: string) => {
    setCurrentConversationId(convId)
    await loadMessages(convId)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentConversationId) {
      if (!currentConversationId) {
        handleNewConversation()
        return
      }
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, created_at: new Date().toISOString() }])
    setIsLoading(true)

    try {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentConversationId,
          role: 'user',
          content: userMessage,
        })
        .select()
        .single()

      if (msgError) throw msgError

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          message: userMessage,
          conversation_id: currentConversationId,
        }),
      })

      let assistantContent = '抱歉，我暂时无法回答这个问题。'
      
      if (response.ok) {
        const data = await response.json()
        assistantContent = data.response || assistantContent
      }

      const { error: assistantError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentConversationId,
          role: 'assistant',
          content: assistantContent,
        })

      if (assistantError) {
        console.error('Failed to save assistant message:', assistantError)
      }

      await supabase
        .from('user_agents')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', agentId)

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantContent, 
        created_at: new Date().toISOString() 
      }])
    } catch {
      toast.error('发送失败，请重试')
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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('已复制')
  }

  const regenerateMessage = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return

    const messagesToRemove = messages.length - messages.indexOf(lastUserMessage)
    setMessages(messages.slice(0, messages.length - messagesToRemove))
    setInput(lastUserMessage.content)
    handleSend()
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {sidebarOpen && (
        <div className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <Button
              onClick={handleNewConversation}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建对话
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-4">暂无对话记录</p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentConversationId === conv.id
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {conv.title || '新对话'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{agent.icon}</span>
              <h2 className="font-semibold text-white">{agent.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/agents/${agentId}/edit`}>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">你好！我是 {agent.name}</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                {agent.description || '有什么可以帮你的吗？'}
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-[#1e3a5f]' : 'bg-[#06b6d4]'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`group relative max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-[#1e3a5f]/90 text-white border border-blue-500/20' 
                  : 'bg-white/12 text-white border border-white/10'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${
                  message.role === 'user' ? 'left-2' : 'right-2'
                }`}>
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="p-1 hover:bg-white/10 rounded"
                    title="复制"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {message.role === 'assistant' && index === messages.length - 1 && (
                    <button
                      onClick={regenerateMessage}
                      className="p-1 hover:bg-white/10 rounded"
                      title="重新生成"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#06b6d4] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/12 p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <Input
              placeholder="输入消息..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            模型: {agent.model} · Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  )
}
