import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, logApiCall } from '@/lib/api/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { agent_id: string } }
) {
  const startTime = Date.now();
  const authHeader = request.headers.get('authorization');
  const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0];

  const auth = await validateApiKey(authHeader, clientIp);
  if (!auth.success) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.error!.status }
    );
  }

  const rateCheck = await checkRateLimit(auth.workspaceId!);
  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429, headers: getRateLimitHeaders(rateCheck) }
    );
  }

  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('id, name, type, status, document_count, created_at')
      .eq('agent_id', params.agent_id)
      .eq('workspace_id', auth.workspaceId)
      .eq('is_active', true);

    if (error) {
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'GET', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'GET', 200, latency);

    return NextResponse.json(
      { success: true, data },
      { headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'GET', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agent_id: string } }
) {
  const startTime = Date.now();
  const authHeader = request.headers.get('authorization');
  const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0];

  const auth = await validateApiKey(authHeader, clientIp);
  if (!auth.success) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.error!.status }
    );
  }

  if (!auth.scopes?.includes('write')) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Write scope required' } },
      { status: 403 }
    );
  }

  const rateCheck = await checkRateLimit(auth.workspaceId!);
  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429, headers: getRateLimitHeaders(rateCheck) }
    );
  }

  try {
    const body = await request.json();
    const { name, type, content } = body;

    if (!name || !type || !content) {
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'POST', 400);
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'name, type, and content are required' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_sources')
      .insert({
        workspace_id: auth.workspaceId,
        agent_id: params.agent_id,
        name,
        type,
        config: { content },
        status: 'pending'
      })
      .select('id, name, type, status, created_at')
      .single();

    if (error) {
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'POST', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'POST', 201, latency);

    return NextResponse.json(
      { success: true, data },
      { status: 201, headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge`, 'POST', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
