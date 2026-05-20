# Mercado Pago Checkout Pro

La integracion activa usa Checkout Pro con Vercel Functions para no bloquear el
checkout por Edge Functions no desplegadas. El frontend crea la orden y sus items,
llama a `/api/create-preference` y redirige al cliente al checkout alojado de
Mercado Pago. El token privado nunca se expone en React.

## Flujo

1. `supabase/functions/create-preference` recibe `orderId`, carga la orden y sus items con service role, genera la preferencia en Mercado Pago y guarda `mp_preference_id`.
2. El frontend redirige a `init_point` o `sandbox_init_point`.
3. `supabase/functions/mp-webhook` recibe notificaciones de pago, valida `x-signature` si `MP_WEBHOOK_SECRET` existe, consulta el pago real en Mercado Pago y llama a `mark_order_paid` si el estado es `approved`.
4. El access token de Mercado Pago se guarda solamente como secret de Edge Function, nunca como `VITE_*`.
5. `supabase/config.toml` deja `create-preference` y `mp-webhook` sin JWT porque el checkout es publico y Mercado Pago no envia token de Supabase.

## Variables privadas necesarias

- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`
- `MP_WEBHOOK_URL`
- `PUBLIC_SITE_URL`

Supabase inyecta `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` por defecto en Edge Functions.

## Deploy

```bash
supabase login
supabase link --project-ref ezmashobmjrahvmtncdn
supabase secrets set MP_ACCESS_TOKEN='PEGAR_ACCESS_TOKEN'
supabase secrets set MP_WEBHOOK_SECRET="$(openssl rand -hex 32)"
supabase secrets set PUBLIC_SITE_URL='https://front-end-igdetailing-shop.vercel.app'
supabase secrets set MP_WEBHOOK_URL='https://ezmashobmjrahvmtncdn.supabase.co/functions/v1/mp-webhook'
supabase functions deploy create-preference
supabase functions deploy mp-webhook
```

Despues, en Mercado Pago Developers, configurar Webhooks con:

```text
https://ezmashobmjrahvmtncdn.supabase.co/functions/v1/mp-webhook
```

Eventos recomendados: pagos / `payment`.

## Pendiente recomendado

1. Crear una Edge Function `create-order` o una RPC transaccional para que el navegador deje de insertar directo en `orders` y `order_items`.
2. Revocar los `insert` publicos directos sobre `orders` y `order_items`.
3. Agregar constraints de integridad para cantidades, precios, stock y estados.
