import { getPool } from './_db.js';

async function getMercadoPagoPayment(paymentId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN no está configurado.');
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar el pago en Mercado Pago.');
  }

  return response.json();
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    const paymentId = String(
      req.query?.['data.id'] ??
      req.body?.data?.id ??
      req.body?.id ??
      ''
    );

    if (!paymentId) {
      return res.status(200).json({ received: true, ignored: 'Sin payment id.' });
    }

    const payment = await getMercadoPagoPayment(paymentId);
    const orderId = payment.external_reference ?? payment.metadata?.order_id;

    if (!orderId) {
      return res.status(200).json({ received: true, ignored: 'Sin referencia de orden.' });
    }

    const client = await getPool().connect();
    try {
      await client.query('begin');

      if (payment.status === 'approved') {
        await client.query('select mark_order_paid($1::uuid)', [orderId]);
      }

      await client.query(
        `update orders
         set mp_payment_id = $1,
             mp_payment_status = $2,
             paid_at = case
               when $2 = 'approved' then coalesce(paid_at, now())
               else paid_at
             end
         where id = $3::uuid`,
        [String(payment.id), payment.status ?? null, orderId]
      );

      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }

    return res.status(200).json({ received: true, payment_status: payment.status });
  } catch (error) {
    console.error('Error procesando webhook Mercado Pago', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Error procesando webhook.',
    });
  }
}
