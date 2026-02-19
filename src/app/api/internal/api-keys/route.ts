import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateApiKey } from '@/lib/api/auth';

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
      .from('api_keys')
      .select('id, name, prefix, scopes, is_active, last_used_at, created_at, expires_at, rate_limit_rpm')
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
    const { workspace_id, name, scopes, expires_at, allowed_ips, rate_limit_rpm } = body;

    if (!workspace_id || !name) {
      return NextResponse.json(
        { success: false, error: 'workspace_id and name are required' },
        { status: 400 }
      );
    }

    const { key, prefix, hash } = generateApiKey();

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        workspace_id,
        name,
        key_hash: hash,
        prefix,
        scopes: scopes || ['read', 'write'],
        expires_at: expires_at || null,
        allowed_ips: allowed_ips || [],
        rate_limit_rpm: rate_limit_rpm || 60,
        is_active: true
      })
      .select('id, name, prefix, scopes, is_active, created_at, expires_at, rate_limit_rpm')
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
        api_key: key
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
    const keyId = url.searchParams.get('id');
    const workspaceId = url.searchParams.get('workspace_id');

    if (!keyId || !workspaceId) {
      return NextResponse.json(
        { success: false, error: 'id and workspace_id are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
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
