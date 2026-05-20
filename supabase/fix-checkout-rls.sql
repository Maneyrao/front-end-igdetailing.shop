-- IG DETAIL - Fix mínimo para que el checkout público pueda crear pedidos.
-- Ejecutar en Supabase SQL Editor si el checkout devuelve:
-- code 42501 / "new row violates row-level security policy for table orders".

alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "anon_insert_orders" on orders;
drop policy if exists "anon_insert_order_items" on order_items;

create policy "anon_insert_orders" on orders
  for insert to anon
  with check (
    order_number is not null
    and customer_name is not null
    and total_amount >= 0
    and coalesce(payment_status, 'pending') = 'pending'
    and coalesce(order_status, 'new') = 'new'
  );

create policy "anon_insert_order_items" on order_items
  for insert to anon
  with check (
    order_id is not null
    and product_name is not null
    and quantity > 0
    and unit_price >= 0
  );
