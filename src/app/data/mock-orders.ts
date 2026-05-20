import { products, type Product } from './products';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'new' | 'contacted' | 'paid' | 'shipped' | 'delivered';
export type PaymentStatus = 'pending' | 'paid';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  notes: string | null;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

// ─── Mock Orders ──────────────────────────────────────────────────────────────

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    order_number: 'IG-0001',
    customer_name: 'Carlos Méndez',
    customer_email: 'carlos.mendez@gmail.com',
    customer_phone: '+54 9 11 5555-1234',
    shipping_address: 'Av. Corrientes 1234',
    shipping_city: 'Buenos Aires',
    notes: 'Por favor dejar en conserjería',
    total_amount: 89990,
    payment_status: 'paid',
    order_status: 'shipped',
    created_at: '2025-04-28T10:30:00Z',
    items: [
      {
        id: 'item-001a',
        product_id: 'beginner-kit',
        product_name: 'Beginner Detail Kit',
        product_image: products.find(p => p.id === 'beginner-kit')?.image || '',
        quantity: 1,
        unit_price: 89990,
      },
    ],
  },
  {
    id: 'ord-002',
    order_number: 'IG-0002',
    customer_name: 'Valentina Torres',
    customer_email: 'vali.torres@hotmail.com',
    customer_phone: '+54 9 11 4444-5678',
    shipping_address: 'Calle Lavalle 789',
    shipping_city: 'Córdoba',
    notes: null,
    total_amount: 64980,
    payment_status: 'pending',
    order_status: 'new',
    created_at: '2025-04-29T08:15:00Z',
    items: [
      {
        id: 'item-002a',
        product_id: 'ceramic-wax',
        product_name: 'Ceramic Spray Wax',
        product_image: products.find(p => p.id === 'ceramic-wax')?.image || '',
        quantity: 1,
        unit_price: 39990,
      },
      {
        id: 'item-002b',
        product_id: 'microfiber-set',
        product_name: 'Premium Microfiber Towel Set',
        product_image: products.find(p => p.id === 'microfiber-set')?.image || '',
        quantity: 1,
        unit_price: 34990,
      },
    ],
  },
  {
    id: 'ord-003',
    order_number: 'IG-0003',
    customer_name: 'Martín Rodríguez',
    customer_email: 'martin.rod@gmail.com',
    customer_phone: '+54 9 11 3333-9012',
    shipping_address: 'Belgrano 456',
    shipping_city: 'Rosario',
    notes: null,
    total_amount: 129990,
    payment_status: 'paid',
    order_status: 'delivered',
    created_at: '2025-04-26T14:00:00Z',
    items: [
      {
        id: 'item-003a',
        product_id: 'shine-kit',
        product_name: 'Ultimate Shine Kit',
        product_image: products.find(p => p.id === 'shine-kit')?.image || '',
        quantity: 1,
        unit_price: 129990,
      },
    ],
  },
  {
    id: 'ord-004',
    order_number: 'IG-0004',
    customer_name: 'Lucía Fernández',
    customer_email: 'lucia.f@outlook.com',
    customer_phone: '+54 9 11 2222-3456',
    shipping_address: 'San Martín 101',
    shipping_city: 'Mendoza',
    notes: 'Llamar antes de enviar',
    total_amount: 52980,
    payment_status: 'pending',
    order_status: 'contacted',
    created_at: '2025-04-29T11:45:00Z',
    items: [
      {
        id: 'item-004a',
        product_id: 'leather-cleaner',
        product_name: 'Leather Cleaner & Conditioner',
        product_image: products.find(p => p.id === 'leather-cleaner')?.image || '',
        quantity: 1,
        unit_price: 29990,
      },
      {
        id: 'item-004b',
        product_id: 'interior-detailer',
        product_name: 'Interior Quick Detailer',
        product_image: products.find(p => p.id === 'interior-detailer')?.image || '',
        quantity: 1,
        unit_price: 22990,
      },
    ],
  },
  {
    id: 'ord-005',
    order_number: 'IG-0005',
    customer_name: 'Agustín Pérez',
    customer_email: 'agus.perez@gmail.com',
    customer_phone: '+54 9 11 1111-7890',
    shipping_address: 'Rivadavia 2000',
    shipping_city: 'Buenos Aires',
    notes: null,
    total_amount: 79990,
    payment_status: 'paid',
    order_status: 'paid',
    created_at: '2025-04-29T16:20:00Z',
    items: [
      {
        id: 'item-005a',
        product_id: 'interior-kit',
        product_name: 'Interior Refresh Kit',
        product_image: products.find(p => p.id === 'interior-kit')?.image || '',
        quantity: 1,
        unit_price: 79990,
      },
    ],
  },
  {
    id: 'ord-006',
    order_number: 'IG-0006',
    customer_name: 'Sofía Gómez',
    customer_email: 'sofia.gomez@icloud.com',
    customer_phone: '+54 9 11 6666-4321',
    shipping_address: 'Mitre 500',
    shipping_city: 'La Plata',
    notes: null,
    total_amount: 82970,
    payment_status: 'pending',
    order_status: 'new',
    created_at: '2025-04-30T09:00:00Z',
    items: [
      {
        id: 'item-006a',
        product_id: 'premium-shampoo',
        product_name: 'pH Neutral Car Shampoo',
        product_image: products.find(p => p.id === 'premium-shampoo')?.image || '',
        quantity: 1,
        unit_price: 24990,
      },
      {
        id: 'item-006b',
        product_id: 'clay-bar',
        product_name: 'Clay Bar Kit',
        product_image: products.find(p => p.id === 'clay-bar')?.image || '',
        quantity: 1,
        unit_price: 27990,
      },
      {
        id: 'item-006c',
        product_id: 'tire-cleaner',
        product_name: 'Tire & Wheel Cleaner',
        product_image: products.find(p => p.id === 'tire-cleaner')?.image || '',
        quantity: 1,
        unit_price: 22990,
      },
    ],
  },
  {
    id: 'ord-007',
    order_number: 'IG-0007',
    customer_name: 'Diego Ramírez',
    customer_email: 'diego.r@gmail.com',
    customer_phone: '+54 9 11 7777-8888',
    shipping_address: 'España 1500',
    shipping_city: 'Tucumán',
    notes: 'Urgente',
    total_amount: 32990,
    payment_status: 'paid',
    order_status: 'shipped',
    created_at: '2025-04-27T12:00:00Z',
    items: [
      {
        id: 'item-007a',
        product_id: 'paint-polish',
        product_name: 'One-Step Paint Polish',
        product_image: products.find(p => p.id === 'paint-polish')?.image || '',
        quantity: 1,
        unit_price: 32990,
      },
    ],
  },
  {
    id: 'ord-008',
    order_number: 'IG-0008',
    customer_name: 'Camila López',
    customer_email: 'cami.lopez@gmail.com',
    customer_phone: '+54 9 11 8888-9999',
    shipping_address: 'Italia 750',
    shipping_city: 'Mar del Plata',
    notes: null,
    total_amount: 69980,
    payment_status: 'pending',
    order_status: 'new',
    created_at: '2025-04-30T10:30:00Z',
    items: [
      {
        id: 'item-008a',
        product_id: 'microfiber-set',
        product_name: 'Premium Microfiber Towel Set',
        product_image: products.find(p => p.id === 'microfiber-set')?.image || '',
        quantity: 1,
        unit_price: 34990,
      },
      {
        id: 'item-008b',
        product_id: 'interior-detailer',
        product_name: 'Interior Quick Detailer',
        product_image: products.find(p => p.id === 'interior-detailer')?.image || '',
        quantity: 1,
        unit_price: 19990,
      },
      {
        id: 'item-008c',
        product_id: 'tire-cleaner',
        product_name: 'Tire & Wheel Cleaner',
        product_image: products.find(p => p.id === 'tire-cleaner')?.image || '',
        quantity: 1,
        unit_price: 22990,
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getOrderById = (id: string): Order | undefined =>
  mockOrders.find(o => o.id === id);

export const getOrdersByStatus = (status: OrderStatus): Order[] =>
  mockOrders.filter(o => o.order_status === status);

export const getMonthlySales = (): number =>
  mockOrders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total_amount, 0);

export const getPendingOrders = (): Order[] =>
  mockOrders.filter(o => o.order_status === 'new' || o.order_status === 'contacted');

export const getRecentOrders = (limit = 5): Order[] =>
  [...mockOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
