import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: agents, error } = await supabase
      .from('user_agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agents: agents || [] })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { user_id, name, description, icon, model, temperature, max_tokens, system_prompt } = body

    if (!user_id || !name || !system_prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: soloUser } = await supabase
      .from('solo_users')
      .select('agent_limit')
      .eq('user_id', user_id)
      .single()

    const { data: existingAgents } = await supabase
      .from('user_agents')
      .select('id', { count: 'exact' })
      .eq('user_id', user_id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agentLimit = (soloUser as any)?.agent_limit || 1
    if ((existingAgents?.length || 0) >= agentLimit) {
      return NextResponse.json(
        { error: 'Agent limit reached' },
        { status: 403 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: agent, error } = await supabase
      .from('user_agents')
      .insert({
        user_id,
        name,
        description: description || null,
        icon: icon || '🤖',
        model: model || 'gpt-4o-mini',
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000,
        system_prompt,
        is_active: true,
      } as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agent })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
