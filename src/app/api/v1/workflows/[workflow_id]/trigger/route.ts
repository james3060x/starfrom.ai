import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, logApiCall } from '@/lib/api/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { workflow_id: string } }
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
    const { inputs, callback_url } = body;

    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('id, name, status')
      .eq('id', params.workflow_id)
      .eq('workspace_id', auth.workspaceId)
      .single();

    if (workflowError || !workflow) {
      await logApiCall(null, auth.workspaceId!, `/v1/workflows/${params.workflow_id}/trigger`, 'POST', 404);
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Workflow not found' } },
        { status: 404, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    if (workflow.status !== 'active') {
      await logApiCall(null, auth.workspaceId!, `/v1/workflows/${params.workflow_id}/trigger`, 'POST', 400);
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Workflow is not active' } },
        { status: 400, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .insert({
        workflow_id: params.workflow_id,
        workspace_id: auth.workspaceId,
        status: 'pending',
        trigger_type: 'api',
        input_data: inputs || {},
        metadata: { callback_url }
      })
      .select('id, status, created_at')
      .single();

    if (runError) {
      await logApiCall(null, auth.workspaceId!, `/v1/workflows/${params.workflow_id}/trigger`, 'POST', 500);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: runError.message } },
        { status: 500, headers: getRateLimitHeaders(rateCheck) }
      );
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/workflows/${params.workflow_id}/trigger`, 'POST', 201, latency);

    return NextResponse.json(
      { 
        success: true, 
        data: {
          run_id: run.id,
          status: run.status,
          created_at: run.created_at
        }
      },
      { status: 201, headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/workflows/${params.workflow_id}/trigger`, 'POST', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
