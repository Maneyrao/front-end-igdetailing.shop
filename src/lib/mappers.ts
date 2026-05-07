import type { Product, Kit, KitItem, Order, OrderItem } from './types';

// ─── Product mappers ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function productFromRow(row: Record<string, any>): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    status: row.status ?? (row.is_active === false ? 'paused' : 'active'),
    image: row.image,
    description: row.description,
    shortDescription: row.short_description,
    whatIsItFor: row.what_is_it_for,
    howToUse: row.how_to_use,
    isBestSeller: row.is_best_seller ?? false,
    isKit: false,
    relatedProducts: row.related_products ?? [],
  };
}

export function productToRow(p: Product): Record<string, unknown> {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    stock: p.stock ?? 0,
    status: p.status ?? 'active',
    image: p.image,
    description: p.description,
    short_description: p.shortDescription,
    what_is_it_for: p.whatIsItFor,
    how_to_use: p.howToUse,
    is_best_seller: p.isBestSeller ?? false,
    is_active: (p.status ?? 'active') === 'active',
    related_products: p.relatedProducts ?? [],
  };
}

// ─── Kit mappers ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function kitFromRow(row: Record<string, any>): Kit {
  const rawItems: Array<{ product_id?: string; productId?: string; quantity: number }> =
    Array.isArray(row.items) ? row.items : [];
  const items: KitItem[] = rawItems.map(i => ({
    productId: i.product_id ?? i.productId ?? '',
    quantity: i.quantity,
  }));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    status: row.status ?? (row.is_active === false ? 'paused' : 'active'),
    image: row.image,
    items,
    isBestSeller: row.is_best_seller ?? false,
    isActive: row.is_active ?? true,
  };
}

export function kitToRow(k: Kit): Record<string, unknown> {
  const items = k.items.map(i => ({ product_id: i.productId, quantity: i.quantity }));
  return {
    name: k.name,
    slug: k.slug,
    short_description: k.shortDescription,
    description: k.description,
    price: k.price,
    stock: k.stock ?? 0,
    status: k.status ?? 'active',
    image: k.image,
    items,
    is_best_seller: k.isBestSeller,
    is_active: k.isActive && (k.status ?? 'active') === 'active',
  };
}

export function kitAsProduct(kit: Kit): Product {
  return {
    id: kit.id,
    name: kit.name,
    slug: kit.slug,
    category: 'kits',
    price: kit.price,
    stock: kit.stock ?? 0,
    status: kit.status ?? (kit.isActive ? 'active' : 'paused'),
    image: kit.image,
    shortDescription: kit.shortDescription,
    description: kit.description,
    whatIsItFor: 'Un kit completo para comprar varios productos juntos y resolver una etapa del cuidado del auto.',
    howToUse: 'Agregalo al carrito y coordinamos la entrega. Cada kit incluye los productos indicados en el panel de administración.',
    isBestSeller: kit.isBestSeller,
    isKit: true,
    relatedProducts: [],
  };
}

// ─── Order mappers ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function orderItemFromRow(row: Record<string, any>): OrderItem {
  return {
    id: row.id,
    product_id: row.product_id,
    product_name: row.product_name,
    product_image: row.product_image ?? undefined,
    quantity: Number(row.quantity ?? 0),
    unit_price: Number(row.unit_price ?? 0),
    item_type: row.item_type ?? 'product',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function orderFromRow(row: Record<string, any>): Order {
  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone,
    shipping_address: row.shipping_address,
    shipping_city: row.shipping_city,
    notes: row.notes,
    total_amount: Number(row.total_amount ?? 0),
    payment_status: row.payment_status ?? 'pending',
    order_status: row.order_status ?? 'new',
    items: Array.isArray(row.items) ? row.items.map(orderItemFromRow) : [],
    created_at: row.created_at,
    mp_preference_id: row.mp_preference_id,
  };
}
