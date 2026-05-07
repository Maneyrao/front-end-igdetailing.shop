-- IG DETAIL - Supabase Schema
-- How to run: paste this entire file into Supabase Dashboard > SQL Editor > New Query > Run.
-- Safe to re-run: tables, columns, indexes, and policies are idempotent.
--
-- Admin note:
-- The admin panel uses Supabase Auth. Create an admin user in Authentication > Users
-- and sign in at /admin. Public visitors can read active catalog items and create
-- checkout orders, but only authenticated users can manage catalog and orders.

create extension if not exists pgcrypto;

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text unique not null,
  category          text,
  price             numeric(10,2) not null,
  stock             integer not null default 0,
  status            text not null default 'active',
  image             text,
  description       text,
  short_description text,
  what_is_it_for    text,
  how_to_use        text,
  related_products  text[] default '{}'::text[],
  is_best_seller    boolean default false,
  is_active         boolean default true,
  created_at        timestamptz default now()
);

create table if not exists kits (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text unique not null,
  price             numeric(10,2) not null,
  stock             integer not null default 0,
  status            text not null default 'active',
  image             text,
  description       text,
  short_description text,
  is_best_seller    boolean default false,
  is_active         boolean default true,
  items             jsonb default '[]'::jsonb,
  created_at        timestamptz default now()
);

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text unique not null,
  customer_name     text not null,
  customer_email    text,
  customer_phone    text,
  shipping_address  text,
  shipping_city     text,
  total_amount      numeric(10,2) not null,
  payment_status    text default 'pending',
  order_status      text default 'new',
  mp_preference_id  text,
  mp_payment_id     text,
  mp_payment_status text,
  paid_at           timestamptz,
  notes             text,
  created_at        timestamptz default now()
);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    text,
  product_name  text not null,
  product_image text,
  quantity      integer not null,
  unit_price    numeric(10,2) not null,
  item_type     text default 'product',
  created_at    timestamptz default now()
);

-- ============================================================
-- MIGRATIONS FOR EXISTING PROJECTS
-- ============================================================

alter table products add column if not exists related_products text[] default '{}'::text[];
alter table products add column if not exists stock integer not null default 0;
alter table products add column if not exists status text not null default 'active';
alter table kits add column if not exists stock integer not null default 0;
alter table kits add column if not exists status text not null default 'active';
alter table orders add column if not exists mp_payment_id text;
alter table orders add column if not exists mp_payment_status text;
alter table orders add column if not exists paid_at timestamptz;
alter table order_items add column if not exists product_image text;
alter table order_items add column if not exists item_type text default 'product';
alter table order_items alter column product_id type text using product_id::text;

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists products_slug_idx on products (slug);
create index if not exists products_category_idx on products (category);
create index if not exists kits_slug_idx on kits (slug);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_mp_preference_id_idx on orders (mp_preference_id);
create index if not exists orders_mp_payment_id_idx on orders (mp_payment_id);
create index if not exists order_items_order_id_idx on order_items (order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products enable row level security;
alter table kits enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "anon_select_products" on products;
drop policy if exists "anon_select_kits" on kits;
drop policy if exists "anon_insert_orders" on orders;
drop policy if exists "anon_insert_order_items" on order_items;
drop policy if exists "auth_all_products" on products;
drop policy if exists "auth_all_kits" on kits;
drop policy if exists "auth_all_orders" on orders;
drop policy if exists "auth_all_order_items" on order_items;

-- Public catalog read: only active products and kits.
create policy "anon_select_products" on products
  for select to anon
  using (is_active = true and status = 'active');

create policy "anon_select_kits" on kits
  for select to anon
  using (is_active = true and status = 'active');

-- Public checkout write: visitors can create an order and its line items.
create policy "anon_insert_orders" on orders
  for insert to anon
  with check (true);

create policy "anon_insert_order_items" on order_items
  for insert to anon
  with check (true);

-- Authenticated admin users: full CRUD from the admin dashboard.
create policy "auth_all_products" on products
  for all to authenticated
  using (true)
  with check (true);

create policy "auth_all_kits" on kits
  for all to authenticated
  using (true)
  with check (true);

create policy "auth_all_orders" on orders
  for all to authenticated
  using (true)
  with check (true);

create policy "auth_all_order_items" on order_items
  for all to authenticated
  using (true)
  with check (true);

-- ============================================================
-- BUSINESS LOGIC
-- ============================================================

create or replace function mark_order_paid(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_payment_status text;
begin
  select payment_status
    into current_payment_status
  from orders
  where id = target_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if current_payment_status = 'paid' then
    return;
  end if;

  if not exists (select 1 from order_items where order_id = target_order_id) then
    raise exception 'Order has no items';
  end if;

  create temporary table if not exists tmp_required_stock (
    product_id uuid primary key,
    required_qty integer not null
  ) on commit drop;

  truncate tmp_required_stock;

  insert into tmp_required_stock (product_id, required_qty)
  select product_id, sum(required_qty)::integer
  from (
    select oi.product_id::uuid as product_id, oi.quantity::integer as required_qty
    from order_items oi
    where oi.order_id = target_order_id
      and coalesce(oi.item_type, 'product') = 'product'

    union all

    select (component.value->>'product_id')::uuid as product_id,
           (oi.quantity::integer * coalesce((component.value->>'quantity')::integer, 1)) as required_qty
    from order_items oi
    join kits k on k.id::text = oi.product_id
    cross join jsonb_array_elements(k.items) as component(value)
    where oi.order_id = target_order_id
      and oi.item_type = 'kit'
  ) required_lines
  group by product_id;

  if exists (
    select 1
    from tmp_required_stock r
    left join products p on p.id = r.product_id
    where p.id is null
  ) then
    raise exception 'Product not found in order items';
  end if;

  perform 1
  from products p
  join tmp_required_stock r on r.product_id = p.id
  for update;

  if exists (
    select 1
    from products p
    join tmp_required_stock r on r.product_id = p.id
    where p.stock < r.required_qty
  ) then
    raise exception 'Not enough stock for one or more products';
  end if;

  update products p
  set stock = p.stock - r.required_qty
  from tmp_required_stock r
  where p.id = r.product_id;

  update orders
  set payment_status = 'paid',
      order_status = 'paid',
      paid_at = coalesce(paid_at, now())
  where id = target_order_id;
end;
$$;

grant execute on function mark_order_paid(uuid) to authenticated;

-- ============================================================
-- MERCADO PAGO PREPARATION
-- ============================================================
-- mp_preference_id, mp_payment_id, mp_payment_status and paid_at are present
-- for Checkout Pro. Use supabase/functions/create-preference to generate
-- Mercado Pago preferences and supabase/functions/mp-webhook to update payment
-- status after Mercado Pago confirms the payment.
