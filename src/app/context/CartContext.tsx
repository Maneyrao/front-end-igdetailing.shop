import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../../lib/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'cart';

function getProductLimit(product: Product) {
  if (product.isKit) return Number.POSITIVE_INFINITY;
  return Math.max(0, Number(product.stock ?? 0));
}

function normalizeQuantity(product: Product, quantity: number) {
  const safeQuantity = Math.floor(Number(quantity));
  if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) return 0;
  return Math.min(safeQuantity, getProductLimit(product));
}

function isStoredCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as CartItem;
  return Boolean(
    item.product &&
      typeof item.product.id === 'string' &&
      typeof item.product.name === 'string' &&
      typeof item.product.price === 'number'
  );
}

function loadInitialCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isStoredCartItem)
      .map((item) => ({
        ...item,
        quantity: normalizeQuantity(item.product, item.quantity),
      }))
      .filter((item) => item.quantity > 0);
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const quantityToAdd = normalizeQuantity(product, quantity);
      if (quantityToAdd <= 0) return prevItems;

      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, product, quantity: normalizeQuantity(product, item.quantity + quantityToAdd) }
            : item
        ).filter(item => item.quantity > 0);
      }
      
      return [...prevItems, { product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems =>
      prevItems
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: normalizeQuantity(item.product, quantity) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
