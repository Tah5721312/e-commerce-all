'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: number;
  selectedSizeId?: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    selectedColor?: number,
    selectedSizeId?: number
  ) => void;
  removeFromCart: (
    productId: number,
    selectedColor?: number,
    selectedSizeId?: number
  ) => void;
  increaseQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSizeId?: number
  ) => void;
  decreaseQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSizeId?: number
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSizeId?: number
  ) => number;
  isInCart: (
    productId: number,
    selectedColor?: number,
    selectedSizeId?: number
  ) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product, selectedColor, selectedSizeId) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          (item) =>
            item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSizeId === selectedSizeId
        );

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === product.id &&
                item.selectedColor === selectedColor &&
                item.selectedSizeId === selectedSizeId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [
              ...cartItems,
              { ...product, quantity: 1, selectedColor, selectedSizeId },
            ],
          });
        }
      },

      removeFromCart: (productId, selectedColor, selectedSizeId) => {
        set({
          cartItems: get().cartItems.filter(
            (item) =>
              !(
                item.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSizeId === selectedSizeId
              )
          ),
        });
      },

      increaseQuantity: (productId, selectedColor, selectedSizeId) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSizeId === selectedSizeId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (productId, selectedColor, selectedSizeId) => {
        const cartItems = get().cartItems;
        const item = cartItems.find(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSizeId === selectedSizeId
        );

        if (item && item.quantity > 1) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSizeId === selectedSizeId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId, selectedColor, selectedSizeId);
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

      getItemQuantity: (productId, selectedColor, selectedSizeId) => {
        const item = get().cartItems.find(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSizeId === selectedSizeId
        );
        return item ? item.quantity : 0;
      },

      isInCart: (productId, selectedColor, selectedSizeId) => {
        return get().cartItems.some(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSizeId === selectedSizeId
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

