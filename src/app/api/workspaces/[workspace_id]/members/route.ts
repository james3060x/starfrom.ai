import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { workspace_id: string } }
) {
  const authHeader = request.headers.get('authorization');
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

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', params.workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { data: members, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:user_id (
          email,
          id
        )
      `)
      .eq('workspace_id', params.workspace_id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: members || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspace_id: string } }
) {
  const authHeader = request.headers.get('authorization');
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

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', params.workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role = 'member' } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    const { data: userToInvite } = await supabase
      .from('user_emails')
      .select('user_id')
      .eq('email', email.toLowerCase())
      .single();

    if (!userToInvite) {
      return NextResponse.json(
        { success: false, error: 'User not found. They must sign up first.' },
        { status: 404 }
      );
    }

    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', params.workspace_id)
      .eq('user_id', userToInvite.user_id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'User is already a member' },
        { status: 400 }
      );
    }

    const { data: member, error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: params.workspace_id,
        user_id: userToInvite.user_id,
        role,
        invited_by: user.id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspace_id: string } }
) {
  const authHeader = request.headers.get('authorization');
  const searchParams = request.nextUrl.searchParams;
  const memberId = searchParams.get('memberId');

  if (!authHeader || !memberId) {
    return NextResponse.json(
      { success: false, error: 'Missing authorization or memberId' },
      { status: 400 }
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

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', params.workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { data: memberToRemove } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('id', memberId)
      .eq('workspace_id', params.workspace_id)
      .single();

    if (!memberToRemove) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    if (memberToRemove.role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove owner' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
