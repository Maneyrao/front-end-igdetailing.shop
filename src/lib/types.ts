export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'wash' | 'interior' | 'protection' | 'accessories' | 'kits';
  price: number;
  stock?: number;
  status?: 'active' | 'paused';
  image: string;
  shortDescription: string;
  description: string;
  whatIsItFor: string;
  howToUse: string;
  isBestSeller?: boolean;
  isKit?: boolean;
  relatedProducts?: string[];
}

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
  stock?: number;
  status?: 'active' | 'paused';
  image: string;
  items: KitItem[];
  isBestSeller: boolean;
  isActive: boolean;
}

export type OrderStatus = 'new' | 'contacted' | 'paid' | 'shipped' | 'delivered';
export type PaymentStatus = 'pending' | 'paid';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  item_type?: 'product' | 'kit';
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
  items?: OrderItem[];
  created_at: string;
  mp_preference_id?: string | null;
  mp_payment_id?: string | null;
  mp_payment_status?: string | null;
  paid_at?: string | null;
}
