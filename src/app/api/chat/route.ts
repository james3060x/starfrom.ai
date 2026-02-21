import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Agent {
  id: string
  name: string
  system_prompt: string
  model: string
  temperature: number
  max_tokens: number
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    const { agent_id, message, conversation_id } = body

    if (!agent_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: agent, error: agentError } = await supabase
      .from('user_agents')
      .select('*')
      .eq('id', agent_id)
      .single() as unknown as any

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(10) as unknown as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversationHistory = messages?.map((m: any) => ({
      role: m.role,
      content: m.content
    })) || []

    const systemMessage = {
      role: 'system',
      content: agent.system_prompt
    }

    const allMessages = [systemMessage, ...conversationHistory, { role: 'user', content: message }]

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: agent.model,
        messages: allMessages,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens,
        stream: false
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      
      return NextResponse.json({
        response: '抱歉，服务暂时不可用。请稍后再试。'
      })
    }

    const data = await openaiResponse.json()
    const assistantMessage = data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase
      .from('user_agents')
      .update({
        total_messages: (agent.total_messages || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', agent_id)

    return NextResponse.json({
      response: assistantMessage
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      response: '抱歉，服务暂时不可用。请稍后再试。'
    })
  }
}
