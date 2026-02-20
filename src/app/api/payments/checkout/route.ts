import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

interface CheckoutRequest {
  userId: string;
  planId: string;
  billingInterval: 'month' | 'year';
}

async function createLemonSqueezyCheckout(data: CheckoutRequest) {
  const { userId, planId } = data;

  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: '',
            custom: {
              user_id: userId,
            },
          },
          preview: true,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: planId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Lemon Squeezy API error: ${error}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { userId, planId, billingInterval } = body;

    if (!userId || !planId) {
      return NextResponse.json(
        { success: false, error: 'userId and planId are required' },
        { status: 400 }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const variantId = billingInterval === 'year' 
      ? subscription.yearly_variant_id 
      : subscription.monthly_variant_id;

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: 'Payment not configured. Please contact support.' },
        { status: 400 }
      );
    }

    const checkoutData = await createLemonSqueezyCheckout({
      userId,
      planId: variantId,
      billingInterval,
    });

    const checkoutUrl = checkoutData.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const planId = searchParams.get('planId');
  const billingInterval = searchParams.get('billingInterval') || 'month';

  if (!planId) {
    return NextResponse.json(
      { success: false, error: 'planId is required' },
      { status: 400 }
    );
  }

  try {
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (error || !plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const variantId = billingInterval === 'year' && plan.yearly_variant_id
      ? plan.yearly_variant_id
      : plan.monthly_variant_id;

    return NextResponse.json({
      success: true,
      data: {
        plan: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthly_price_cents / 100,
          yearlyPrice: plan.yearly_price_cents / 100,
          features: plan.features,
          limits: {
            agents: plan.agent_limit,
            conversations: plan.conversation_limit,
            messages: plan.message_limit,
            storage: plan.storage_limit_mb,
            knowledgeBases: plan.knowledge_base_limit,
            apiCalls: plan.api_calls_limit,
          },
        },
        variantId,
        billingInterval,
      },
    });
  } catch (error) {
    console.error('Get plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
