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
  { params }: { params: { session_id: string } }
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
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const { data: messages, error, count } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at', { count: 'exact' })
      .eq('session_id', params.session_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      await logApiCall(null, auth.workspaceId!, `/v1/sessions/${params.session_id}/messages`, 'GET', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/sessions/${params.session_id}/messages`, 'GET', 200, latency);

    return NextResponse.json(
      { 
        success: true, 
        data: messages,
        pagination: {
          total: count || 0,
          limit,
          offset
        }
      },
      { headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/sessions/${params.session_id}/messages`, 'GET', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
