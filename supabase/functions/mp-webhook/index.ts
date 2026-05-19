import { createClient } from 'npm:@supabase/supabase-js@2';
import { MercadoPagoConfig, Payment } from 'npm:mercadopago';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function hmacSha256Hex(secret: string, message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function validateMercadoPagoSignature(req: Request, url: URL, bodyDataId?: string) {
  const secret = Deno.env.get('MP_WEBHOOK_SECRET');
  if (!secret) return true;

  const xSignature = req.headers.get('x-signature') ?? '';
  const xRequestId = req.headers.get('x-request-id') ?? '';
  const dataId = (url.searchParams.get('data.id') ?? bodyDataId ?? '').toLowerCase();

  const parts = Object.fromEntries(
    xSignature.split(',').map((part) => {
      const [key, value] = part.split('=');
      return [key?.trim(), value?.trim()];
    })
  );

  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash || !xRequestId || !dataId) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = await hmacSha256Hex(secret, manifest);
  return timingSafeEqual(expected, hash);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  const accessToken = Deno.env.get('MP_ACCESS_TOKEN') ?? Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!accessToken || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Faltan variables de entorno privadas.' }, 500);
  }

  const url = new URL(req.url);
  const body = await req.json().catch(() => ({}));
  const paymentId = String(url.searchParams.get('data.id') ?? body?.data?.id ?? body?.id ?? '');

  const validSignature = await validateMercadoPagoSignature(req, url, paymentId);
  if (!validSignature) {
    return jsonResponse({ error: 'Firma inválida.' }, 401);
  }

  if (!paymentId) {
    return jsonResponse({ received: true, ignored: 'Sin payment id.' });
  }

  const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
  const payment = await new Payment(client).get({ id: paymentId });
  const orderId = payment.external_reference ?? payment.metadata?.order_id;

  if (!orderId) {
    return jsonResponse({ received: true, ignored: 'El pago no tiene external_reference.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const paymentPatch = {
    mp_payment_id: String(payment.id),
    mp_payment_status: payment.status ?? null,
  };

  if (payment.status === 'approved') {
    const { error: rpcError } = await supabase.rpc('mark_order_paid', { target_order_id: orderId });
    if (rpcError) {
      return jsonResponse({ error: rpcError.message }, 500);
    }

    await supabase
      .from('orders')
      .update({ ...paymentPatch, paid_at: new Date().toISOString() })
      .eq('id', orderId);
  } else {
    await supabase
      .from('orders')
      .update(paymentPatch)
      .eq('id', orderId);
  }

  return jsonResponse({ received: true, payment_status: payment.status });
});
