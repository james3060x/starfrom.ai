import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, logApiCall } from '@/lib/api/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const DEFAULT_TOP_K = 5;

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
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

  const rateCheck = await checkRateLimit(auth.workspaceId!);
  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429, headers: getRateLimitHeaders(rateCheck) }
    );
  }

  try {
    const body = await request.json();
    const { query, knowledgeBaseId, topK = DEFAULT_TOP_K } = body;

    if (!query) {
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge/search`, 'POST', 400);
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'query is required' } },
        { status: 400 }
      );
    }

    let kbId = knowledgeBaseId;

    if (!kbId) {
      const { data: agent } = await supabase
        .from('user_agents')
        .select('knowledge_base_id')
        .eq('id', params.agent_id)
        .eq('user_id', auth.workspaceId)
        .single();

      if (agent?.knowledge_base_id) {
        kbId = agent.knowledge_base_id;
      }
    }

    if (!kbId) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'No knowledge base found for this agent' } },
        { status: 404 }
      );
    }

    const embedding = await getEmbedding(query);

    const { data: chunks, error } = await supabase.rpc('match_knowledge_chunks', {
      p_knowledge_base_id: kbId,
      p_embedding: embedding,
      p_top_k: topK,
    });

    if (error) {
      console.error('Vector search error:', error);
      
      const { data: fallbackChunks } = await supabase
        .from('knowledge_chunks')
        .select('id, content, metadata')
        .eq('knowledge_base_id', kbId)
        .limit(topK);

      const latency = Date.now() - startTime;
      await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge/search`, 'POST', 200, latency);

      return NextResponse.json({
        success: true,
        data: {
          query,
          chunks: fallbackChunks || [],
          knowledgeBaseId: kbId,
        },
      }, { headers: getRateLimitHeaders(rateCheck) });
    }

    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge/search`, 'POST', 200, latency);

    return NextResponse.json(
      {
        success: true,
        data: {
          query,
          chunks: chunks || [],
          knowledgeBaseId: kbId,
        },
      },
      { headers: getRateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    const latency = Date.now() - startTime;
    await logApiCall(null, auth.workspaceId!, `/v1/agents/${params.agent_id}/knowledge/search`, 'POST', 500, latency, undefined, String(error));
    
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: String(error) } },
      { status: 500, headers: getRateLimitHeaders(rateCheck) }
    );
  }
}
