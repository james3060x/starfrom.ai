import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, scenario } = body

    const apiKey = process.env.DIFY_API_KEY
    const apiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1'

    if (!apiKey) {
      return NextResponse.json(
        { response: '这是一个模拟回复。实际部署需要配置 Dify API Key。' }
      )
    }

    const response = await fetch(`${apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { scenario },
        query: message,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'demo-user',
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { response: '服务暂时不可用，请稍后重试。' },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ response: data.answer })
  } catch (error) {
    console.error('Demo chat error:', error)
    return NextResponse.json(
      { response: '抱歉，我暂时无法回答这个问题。' },
      { status: 200 }
    )
  }
}
