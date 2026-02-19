import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateMcpToken } from '@/lib/mcp/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('mcp_tokens')
      .select('id, name, prefix, is_active, last_used_at, created_at, expires_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspace_id, name, expires_at } = body;

    if (!workspace_id || !name) {
      return NextResponse.json(
        { success: false, error: 'workspace_id and name are required' },
        { status: 400 }
      );
    }

    const { token, prefix, hash } = generateMcpToken();

    const { data, error } = await supabase
      .from('mcp_tokens')
      .insert({
        workspace_id,
        name,
        token_hash: hash,
        prefix,
        expires_at: expires_at || null,
        is_active: true
      })
      .select('id, name, prefix, is_active, created_at, expires_at')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...data,
        mcp_token: token
      }
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tokenId = url.searchParams.get('id');
    const workspaceId = url.searchParams.get('workspace_id');

    if (!tokenId || !workspaceId) {
      return NextResponse.json(
        { success: false, error: 'id and workspace_id are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('mcp_tokens')
      .delete()
      .eq('id', tokenId)
      .eq('workspace_id', workspaceId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
