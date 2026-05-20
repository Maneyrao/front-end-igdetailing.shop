# Proyecto: IG Detailing Shop - E-Commerce & Admin Dashboard

Este archivo provee contexto para Claude Code sobre el estado actual del proyecto y el plan de implementación del backend.

## Contexto del Proyecto
- **Frontend Stack:** React, Vite (v8.0.10), TailwindCSS, React Router, Framer Motion, Lucide React.
- **Estado Actual:** 
  - La Landing Page y la tienda (frontend) están maquetadas.
  - El Panel de Administración (`/admin`, `/admin/products`, `/admin/orders`) está completamente construido y funcional usando datos "mock" (falsos) locales ubicados en `src/app/data/`.
  - El panel diferencia entre "Productos Sueltos" y "Kits" y formatea precios en ARS (Pesos Argentinos).
- **Objetivo Próximo:** Migrar toda la lógica de datos "mock" a un backend real usando **Supabase**. *Nota: Mercado Pago no se integrará en esta etapa, pero la base de datos debe quedar preparada para hacerlo a futuro.*

---

## Plan de Ejecución para el Backend (Supabase)

Claude, tu objetivo es ejecutar las siguientes fases paso a paso para completar la integración inicial.

### Fase 1: Configuración de Supabase y Base de Datos
1. **Instalar SDK:** Instalar `@supabase/supabase-js`.
2. **Variables de Entorno:** Configurar `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (solicítalas al usuario).
3. **Inicializar Cliente:** Crear `src/lib/supabase.ts` para exportar el cliente.
4. **Crear Esquema SQL:** Crear `supabase/schema.sql` con las tablas:
   - `products` (id uuid, name text, slug text, category text, price numeric, image text, description text, short_description text, what_is_it_for text, how_to_use text, is_best_seller boolean, is_active boolean).
   - `kits` (id uuid, name text, slug text, price numeric, image text, description text, short_description text, is_best_seller boolean, is_active boolean, items jsonb).
   - `orders` (id uuid, order_number text, customer_name text, customer_email text, customer_phone text, shipping_address text, shipping_city text, total_amount numeric, payment_status text, order_status text, mp_preference_id text, notes text, created_at timestamp). 
     *(Nota: mp_preference_id es para preparar el terreno para Mercado Pago a futuro).*
   - *Solicitar al usuario que ejecute este script en el SQL Editor de su proyecto Supabase.*

### Fase 2: Conexión Frontend -> Supabase
1. **Migrar Productos y Kits:**
   - Modificar `src/app/pages/admin/AdminProducts.tsx`.
   - Reemplazar imports de mock-data por llamadas reales (`supabase.from('products').select()`).
   - Implementar las funciones de Crear/Editar/Eliminar apuntando a Supabase.
2. **Migrar Órdenes (Admin):**
   - Modificar `src/app/pages/admin/AdminOrders.tsx` y `AdminDashboard.tsx` para leer/escribir de la tabla `orders` en Supabase.
   - El admin marcará los pagos manualmente por ahora.

### Fase 3: Checkout y Compra Manual en el Frontend
1. **Modificar CheckoutPage:**
   - Al enviar el formulario, el frontend debe hacer un `INSERT` directo en la tabla `orders` de Supabase con `payment_status: 'pending'` y `order_status: 'new'`.
   - Mostrarle al usuario los datos para hacer una transferencia manual (o coordinar por WhatsApp).
2. **Página de Éxito:**
   - Modificar `OrderSuccess.tsx` para confirmar que el pedido fue recibido y limpiar el carrito.

### Fase 4: Preparación para Mercado Pago (Opcional/Futuro)
- Dejar documentado que para integrar Mercado Pago luego, el `INSERT` del checkout deberá cambiarse por una llamada a una *Supabase Edge Function* (`create-preference`), la cual devolverá un link de pago, y un Webhook actualizará el estado de la orden a `paid`.
