import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30d';

  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: 'No authorization header' },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const { data: apiCalls, error } = await supabase
      .from('api_call_logs')
      .select('endpoint, method, status_code, latency_ms, tokens_used, called_at')
      .eq('user_id', user.id)
      .gte('called_at', startDate.toISOString())
      .order('called_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const totalCalls = apiCalls?.length || 0;
    const successfulCalls = apiCalls?.filter(c => c.status_code && c.status_code < 400).length || 0;
    const failedCalls = totalCalls - successfulCalls;
    const avgLatency = apiCalls?.reduce((sum, c) => sum + (c.latency_ms || 0), 0) / (totalCalls || 1);
    const totalTokens = apiCalls?.reduce((sum, c) => sum + (c.tokens_used || 0), 0) || 0;

    const callsByDay: Record<string, number> = {};
    apiCalls?.forEach(call => {
      const day = call.called_at?.split('T')[0] || 'unknown';
      callsByDay[day] = (callsByDay[day] || 0) + 1;
    });

    const callsByEndpoint: Record<string, number> = {};
    apiCalls?.forEach(call => {
      const endpoint = call.endpoint || 'unknown';
      callsByEndpoint[endpoint] = (callsByEndpoint[endpoint] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        period,
        summary: {
          totalCalls,
          successfulCalls,
          failedCalls,
          avgLatencyMs: Math.round(avgLatency),
          totalTokens,
        },
        timeline: callsByDay,
        byEndpoint: callsByEndpoint,
        recentCalls: apiCalls?.slice(0, 20) || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
