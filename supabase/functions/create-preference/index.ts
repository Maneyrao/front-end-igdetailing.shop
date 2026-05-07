import { createClient } from 'npm:@supabase/supabase-js@2';
import { MercadoPagoConfig, Preference } from 'npm:mercadopago';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'http://localhost:5175';
  const webhookUrl = Deno.env.get('MP_WEBHOOK_URL');

  if (!accessToken || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Faltan variables de entorno privadas para Mercado Pago o Supabase.' }, 500);
  }

  const { orderId } = await req.json().catch(() => ({ orderId: null }));
  if (!orderId || typeof orderId !== 'string') {
    return jsonResponse({ error: 'orderId es obligatorio.' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_number, customer_email, customer_name, payment_status, total_amount')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return jsonResponse({ error: 'No se encontró la orden.' }, 404);
  }

  if (order.payment_status === 'paid') {
    return jsonResponse({ error: 'La orden ya está pagada.' }, 409);
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity, unit_price')
    .eq('order_id', orderId);

  if (itemsError) {
    return jsonResponse({ error: 'No se pudieron cargar los ítems de la orden.' }, 500);
  }

  if (!items || items.length === 0) {
    return jsonResponse({ error: 'La orden no tiene ítems.' }, 400);
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 5000 },
  });

  const preference = new Preference(client);
  const notificationUrl = webhookUrl ? `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}source_news=webhooks` : undefined;

  const mpPreference = await preference.create({
    body: {
      items: (items as OrderItemRow[]).map((item) => ({
        id: item.product_id ?? undefined,
        title: item.product_name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: 'ARS',
      })),
      payer: {
        name: order.customer_name ?? undefined,
        email: order.customer_email ?? undefined,
      },
      external_reference: order.id,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      back_urls: {
        success: `${publicSiteUrl}/order-success`,
        pending: `${publicSiteUrl}/order-success`,
        failure: `${publicSiteUrl}/cart`,
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
    },
  });

  const { error: updateError } = await supabase
    .from('orders')
    .update({ mp_preference_id: mpPreference.id })
    .eq('id', order.id);

  if (updateError) {
    return jsonResponse({ error: 'Se creó la preferencia, pero no se pudo guardar en la orden.' }, 500);
  }

  return jsonResponse({
    id: mpPreference.id,
    init_point: mpPreference.init_point,
    sandbox_init_point: mpPreference.sandbox_init_point,
  });
});
