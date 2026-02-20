import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      customer_id?: string;
      order_id?: string;
      status?: string;
      plan_name?: string;
      billing_interval?: string;
      price_cents?: number;
      currency?: string;
      trial_ends_at?: string;
      current_period_start?: string;
      current_period_end?: string;
      cancelled_at?: string;
      ends_at?: string;
      card_brand?: string;
      card_last_four?: string;
    };
  };
}

function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
    console.error('Lemon Squeezy webhook secret not configured');
    return false;
  }
  
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

async function handleSubscriptionCreated(payload: LemonSqueezyWebhookPayload) {
  const { data } = payload;
  const customData = payload.meta.custom_data;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  const attrs = data.attributes;

  await supabase.from('subscriptions').upsert({
    user_id: customData.user_id,
    lemon_squeezy_subscription_id: data.id,
    lemon_squeezy_customer_id: attrs.customer_id,
    lemon_squeezy_order_id: attrs.order_id,
    plan_name: attrs.plan_name,
    status: attrs.status,
    billing_interval: attrs.billing_interval,
    price_amount_cents: attrs.price_cents,
    currency: attrs.currency,
    trial_ends_at: attrs.trial_ends_at,
    current_period_start: attrs.current_period_start,
    current_period_end: attrs.current_period_end,
  }, { onConflict: 'user_id' });
}

async function handleSubscriptionUpdated(payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data;
  const subscriptionData = payload.data;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  const attrs = subscriptionData.attributes;
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('lemon_squeezy_subscription_id', subscriptionData.id)
    .single();

  if (!subscription) {
    console.error('Subscription not found');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: attrs.status,
      plan_name: attrs.plan_name,
      billing_interval: attrs.billing_interval,
      price_amount_cents: attrs.price_cents,
      current_period_start: attrs.current_period_start,
      current_period_end: attrs.current_period_end,
      cancelled_at: attrs.cancelled_at,
      ends_at: attrs.ends_at,
      card_brand: attrs.card_brand,
      card_last_four: attrs.card_last_four,
    })
    .eq('user_id', customData.user_id);
}

async function handleSubscriptionCancelled(payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('user_id', customData.user_id);
}

async function handleSubscriptionExpired(payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
    })
    .eq('user_id', customData.user_id);
}

async function handlePaymentSucceeded(payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data;
  const paymentData = payload.data;
  const attrs = paymentData.attributes;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  await supabase.from('invoices').insert({
    user_id: customData.user_id,
    lemon_squeezy_invoice_id: paymentData.id,
    lemon_squeezy_order_id: attrs.order_id,
    status: 'paid',
    total_cents: attrs.price_cents,
    currency: attrs.currency,
    paid_at: new Date().toISOString(),
  });
}

async function handlePaymentFailed(payload: LemonSqueezyWebhookPayload) {
  const customData = payload.meta.custom_data;
  
  if (!customData?.user_id) {
    console.error('No user_id in webhook payload');
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('user_id', customData.user_id);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature || !verifyWebhookSignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data: LemonSqueezyWebhookPayload = JSON.parse(payload);
    const eventName = data.meta.event_name;

    console.log(`Processing Lemon Squeezy webhook: ${eventName}`);

    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;
      case 'subscription_expired':
        await handleSubscriptionExpired(data);
        break;
      case 'payment_succeeded':
        await handlePaymentSucceeded(data);
        break;
      case 'payment_failed':
        await handlePaymentFailed(data);
        break;
      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
