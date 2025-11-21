'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [...cartItems, { ...product, quantity: 1 }],
          });
        }
      },

      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== productId),
        });
      },

      increaseQuantity: (productId) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      decreaseQuantity: (productId) => {
        const cartItems = get().cartItems;
        const item = cartItems.find((item) => item.id === productId);

        if (item && item.quantity > 1) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId);
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        );
      },

      getItemQuantity: (productId) => {
        const item = get().cartItems.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId) => {
        return get().cartItems.some((item) => item.id === productId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

