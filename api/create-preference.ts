const MP_API_URL = 'https://api.mercadopago.com/checkout/preferences';
const FREE_SHIPPING_FROM = 50000;
const STANDARD_SHIPPING_COST = 4500;

type CheckoutItem = {
  id: string;
  quantity: number;
  itemType?: 'product' | 'kit';
};

type CatalogItem = {
  id: string;
  name: string;
  price: number;
};

function json(res: any, status: number, body: unknown) {
  res.status(status).json(body);
}

function getSiteUrl(req: any) {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
    req.headers.origin ||
    'https://front-end-igdetailing-shop.vercel.app'
  );
}

async function fetchCatalogItem(
  table: 'products' | 'kits',
  id: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<CatalogItem> {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  url.searchParams.set('select', 'id,name,price');
  url.searchParams.set('id', `eq.${id}`);
  url.searchParams.set('is_active', 'eq.true');
  url.searchParams.set('status', 'eq.active');
  url.searchParams.set('limit', '1');

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo validar el catálogo (${table}).`);
  }

  const [item] = await response.json();
  if (!item) {
    throw new Error('Uno de los productos ya no está disponible.');
  }

  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Método no permitido.' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !supabaseKey) {
    return json(res, 500, { error: 'Faltan variables privadas para iniciar el pago.' });
  }

  try {
    const {
      orderId,
      orderNumber,
      customerName,
      customerEmail,
      items,
    } = req.body ?? {};

    if (!orderId || !orderNumber || !Array.isArray(items) || items.length === 0) {
      return json(res, 400, { error: 'Faltan datos de la orden.' });
    }

    const normalizedItems: CheckoutItem[] = items.map((item: any) => ({
      id: String(item.id ?? ''),
      quantity: Math.max(1, Math.floor(Number(item.quantity ?? 1))),
      itemType: item.itemType === 'kit' ? 'kit' as const : 'product' as const,
    })).filter((item) => item.id);

    if (normalizedItems.length === 0) {
      return json(res, 400, { error: 'La orden no tiene productos válidos.' });
    }

    const preferenceItems = await Promise.all(
      normalizedItems.map(async (item) => {
        const catalogItem = await fetchCatalogItem(
          item.itemType === 'kit' ? 'kits' : 'products',
          item.id,
          supabaseUrl,
          supabaseKey
        );

        return {
          id: catalogItem.id,
          title: catalogItem.name,
          quantity: item.quantity,
          unit_price: catalogItem.price,
          currency_id: 'ARS',
        };
      })
    );

    const subtotal = preferenceItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : STANDARD_SHIPPING_COST;

    if (shipping > 0) {
      preferenceItems.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: shipping,
        currency_id: 'ARS',
      });
    }

    const siteUrl = getSiteUrl(req).replace(/\/$/, '');
    const notificationUrl = `${siteUrl}/api/mp-webhook`;

    const preferenceResponse = await fetch(MP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: preferenceItems,
        payer: {
          name: customerName || undefined,
          email: customerEmail || undefined,
        },
        external_reference: String(orderId),
        metadata: {
          order_id: String(orderId),
          order_number: String(orderNumber),
        },
        back_urls: {
          success: `${siteUrl}/order-success?order_number=${encodeURIComponent(orderNumber)}&payment=approved`,
          pending: `${siteUrl}/order-success?order_number=${encodeURIComponent(orderNumber)}&payment=pending`,
          failure: `${siteUrl}/cart?payment=failure`,
        },
        auto_return: 'approved',
        notification_url: notificationUrl,
      }),
    });

    const preference = await preferenceResponse.json();
    if (!preferenceResponse.ok) {
      return json(res, preferenceResponse.status, {
        error: preference.message || 'Mercado Pago rechazó la preferencia.',
      });
    }

    return json(res, 200, {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : 'No se pudo iniciar Mercado Pago.',
    });
  }
}
