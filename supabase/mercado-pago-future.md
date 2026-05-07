# Preparacion para Mercado Pago

La integracion inicial usa checkout manual: el frontend inserta una fila en `orders`
con `payment_status = 'pending'` y luego inserta sus filas en `order_items`.

Ya queda creada la base para integrar Checkout Pro con Supabase Edge Functions:

1. `supabase/functions/create-preference` recibe `orderId`, carga la orden y sus items con service role, genera la preferencia en Mercado Pago y guarda `mp_preference_id`.
2. El frontend debe redirigir a `init_point` o `sandbox_init_point`.
3. `supabase/functions/mp-webhook` recibe notificaciones de pago, valida `x-signature` si `MP_WEBHOOK_SECRET` existe, consulta el pago real en Mercado Pago y llama a `mark_order_paid` si el estado es `approved`.
4. El access token de Mercado Pago se guarda solamente como secret de Edge Function, nunca como `VITE_*`.

Variables privadas necesarias:

- `MERCADOPAGO_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`
- `MP_WEBHOOK_URL`
- `PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Siguiente paso recomendado antes de activar pagos:

1. Crear una Edge Function `create-manual-order` o una RPC transaccional para que el navegador deje de insertar directo en `orders` y `order_items`.
2. Revocar los `insert` públicos directos sobre `orders` y `order_items`.
3. Restringir el admin a usuarios reales con tabla `admin_users`.
4. Agregar constraints de integridad para cantidades, precios, stock y estados.

El campo `mp_preference_id` ya existe en `orders` para ese paso futuro.
