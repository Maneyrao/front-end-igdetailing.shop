import { products, type Product } from './products';

// ─── Kit Types ────────────────────────────────────────────────────────────────

export interface KitItem {
  productId: string;
  quantity: number;
}

export interface Kit {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  items: KitItem[];
  isBestSeller: boolean;
  isActive: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export const getKitProducts = (kit: Kit): { product: Product; quantity: number }[] =>
  kit.items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number }[];

// ─── Mock Kits ────────────────────────────────────────────────────────────────

export const mockKits: Kit[] = [
  {
    id: 'kit-beginner',
    name: 'Kit Principiante',
    slug: 'kit-principiante',
    shortDescription: 'Todo lo que necesitás para empezar a detallar',
    description: 'Kit completo con shampoo pH neutro, toallas de microfibra, limpiador de llantas y spray de interior. Ideal para quien empieza.',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isBestSeller: true,
    isActive: true,
    items: [
      { productId: 'premium-shampoo', quantity: 1 },
      { productId: 'microfiber-set', quantity: 1 },
      { productId: 'tire-cleaner', quantity: 1 },
      { productId: 'interior-detailer', quantity: 1 },
    ],
  },
  {
    id: 'kit-interior',
    name: 'Kit Interior Completo',
    slug: 'kit-interior-completo',
    shortDescription: 'Limpieza y protección profunda del interior',
    description: 'Limpiador y acondicionador de cuero, detailer de interior y microfibras especializadas. Para tapizados, tablero y consola.',
    price: 79990,
    image: 'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isBestSeller: true,
    isActive: true,
    items: [
      { productId: 'leather-cleaner', quantity: 1 },
      { productId: 'interior-detailer', quantity: 1 },
      { productId: 'microfiber-set', quantity: 1 },
    ],
  },
  {
    id: 'kit-shine',
    name: 'Kit Brillo Total',
    slug: 'kit-brillo-total',
    shortDescription: 'Máximo brillo y protección para obsesionados con la pintura',
    description: 'Sistema de corrección y protección premium. Incluye arcilla descontaminante, pulidor, cera cerámica y aplicadores.',
    price: 129990,
    image: 'https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isBestSeller: true,
    isActive: true,
    items: [
      { productId: 'clay-bar', quantity: 1 },
      { productId: 'paint-polish', quantity: 1 },
      { productId: 'ceramic-wax', quantity: 1 },
      { productId: 'microfiber-set', quantity: 1 },
    ],
  },
];
