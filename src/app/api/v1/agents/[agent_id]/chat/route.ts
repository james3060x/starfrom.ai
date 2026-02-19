import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, logApiCall } from '@/lib/api/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';

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

  const rateCheck = await checkRateLimit(auth.workspaceId!);
  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429, headers: getRateLimitHeaders(rateCheck) }
    );
  }

  try {
    const body = await request.json();
    const { message, session_id } = body;

    if (!message || typeof message !== 'string') {
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/chat`, 'POST', 400);
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Message is required' } },
        { status: 400 }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/chat`, 'POST', 200, latency);

    return NextResponse.json(
      { 
        success: true, 
        data: {
          message: 'This is a placeholder response. Agent integration pending.',
          session_id: session_id || 'new-session-id',
          agent_id: params.agent_id,
          timestamp: new Date().toISOString()
        }
      },
      { headers: getRateLimitHeaders(rateCheck) }
    );

  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/chat`, 'POST', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
