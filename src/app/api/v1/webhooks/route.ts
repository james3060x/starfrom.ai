import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, logApiCall } from '@/lib/api/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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
      .from('webhooks')
      .select('id, name, url, events, is_active, created_at')
      .eq('workspace_id', auth.workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'GET', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'GET', 200, latency);

    return NextResponse.json(
      { success: true, data },
      { headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'GET', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { name, url, events, secret } = body;

    if (!name || !url || !events || !Array.isArray(events) || events.length === 0) {
      await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'POST', 400);
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'name, url, and events (array) are required' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        workspace_id: auth.workspaceId,
        name,
        url,
        events,
        secret: secret || null,
        is_active: true
      })
      .select('id, name, url, events, is_active, created_at')
      .single();

    if (error) {
      await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'POST', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'POST', 201, latency);

    return NextResponse.json(
      { success: true, data },
      { status: 201, headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, '/v1/webhooks', 'POST', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now();
  const authHeader = request.headers.get('authorization');
  const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0];
  const url = new URL(request.url);
  const webhookId = url.searchParams.get('id');

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

  if (!webhookId) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'webhook id is required' } },
      { status: 400 }
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
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', webhookId)
      .eq('workspace_id', auth.workspaceId);

    if (error) {
      await logApiCall(null, auth.workspaceId!, `/v1/webhooks/${webhookId}`, 'DELETE', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/webhooks/${webhookId}`, 'DELETE', 200, latency);

    return NextResponse.json(
      { success: true },
      { headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/webhooks/${webhookId}`, 'DELETE', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
