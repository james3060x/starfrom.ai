import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface LeadInsertData {
  company_name?: string
  contact_name: string
  contact_phone?: string
  contact_wechat?: string
  contact_email?: string
  industry?: string
  company_size?: string
  need_type?: string
  selected_modules?: unknown
  budget_range?: string
  expected_timeline?: string
  notes?: string
  source?: string
  status: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const supabase = createClient()
    
    const insertData: LeadInsertData = {
      company_name: body.company_name,
      contact_name: body.contact_name,
      contact_phone: body.contact_phone,
      contact_wechat: body.contact_wechat,
      contact_email: body.contact_email,
      industry: body.industry,
      company_size: body.company_size,
      need_type: body.need_type?.join(', '),
      selected_modules: body.selected_modules || [],
      budget_range: body.budget_range,
      expected_timeline: body.expected_timeline,
      notes: body.notes,
      source: body.source || 'contact',
      status: 'new',
    }
    
    const { data, error } = await supabase
      .from('service_leads')
      .insert(insertData as never)
      .select()
    
    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data })
  } catch {
    console.error('Error in leads API')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
