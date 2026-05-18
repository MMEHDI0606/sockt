import { validateEvent } from '@polar-sh/sdk/webhooks';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
  const body = await req.text();
  const reqHeaders = await headers();

  const webhookHeaders = {
    'webhook-id': reqHeaders.get('webhook-id') as string,
    'webhook-timestamp': reqHeaders.get('webhook-timestamp') as string,
    'webhook-signature': reqHeaders.get('webhook-signature') as string,
  };

  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse('Webhook secret is not configured.', { status: 500 });
  }

  try {
    const webhookPayload = validateEvent(body, webhookHeaders, webhookSecret);

    switch (webhookPayload.type) {
      case 'order.paid': {
        const order = webhookPayload.data;
        const userId = order.metadata?.userId;
        const amountCents = order.totalAmount; // Ensure amount maps to cents properly, Polar returns amount in cents

        if (!userId) {
          console.error('No userId found in order metadata', order.id);
          return new NextResponse('OK', { status: 200 }); // Return 200 to prevent retries if invalid metadata
        }

        const supabaseAdmin = createAdminClient();

        // Note: For production with high traffic, use a Postgres RPC call for atomic increments:
        // await supabaseAdmin.rpc('increment_credit_balance', { amount_cents: amountCents, user_id: userId })
        
        // Fetch current user
        const { data: userProfile, error: profileError } = await supabaseAdmin
          .from('users')
          .select('credit_balance_usd_cents')
          .eq('id', userId)
          .single();

        if (profileError || !userProfile) {
          console.error('User not found', profileError);
          return new NextResponse('User not found', { status: 404 });
        }

        const currentBalance = userProfile.credit_balance_usd_cents || 0;
        const newBalance = currentBalance + amountCents;

        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ credit_balance_usd_cents: newBalance })
          .eq('id', userId);

        if (updateError) {
          console.error('Failed to update balance', updateError);
          return new NextResponse('Failed to update balance', { status: 500 });
        }

        console.log(`Successfully added ${amountCents} cents to user ${userId}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${webhookPayload.type}`);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Webhook signature verification failed.', error);
    return new NextResponse('Invalid Webhook Signature', { status: 403 });
  }
}
