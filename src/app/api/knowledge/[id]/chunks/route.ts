import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const { data: knowledgeBase, error: kbError } = await supabase
      .from('knowledge_bases')
      .select('*')
      .eq('id', params.id)
      .single();

    if (kbError || !knowledgeBase) {
      return NextResponse.json(
        { success: false, error: 'Knowledge base not found' },
        { status: 404 }
      );
    }

    let searchQuery = supabase
      .from('knowledge_chunks')
      .select('id, content, metadata, chunk_index')
      .eq('knowledge_base_id', params.id);

    if (query) {
      searchQuery = searchQuery.ilike('content', `%${query}%`);
    }

    const { data: chunks, error } = await searchQuery.limit(limit);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        knowledgeBase,
        chunks: chunks || [],
        query,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
