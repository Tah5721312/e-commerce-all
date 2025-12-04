'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductSize } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: number;
  selectedSize?: ProductSize;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => void;
  removeFromCart: (
    productId: number,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => void;
  increaseQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => void;
  decreaseQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemQuantity: (
    productId: number,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => number;
  isInCart: (
    productId: number,
    selectedColor?: number,
    selectedSize?: ProductSize
  ) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product, selectedColor, selectedSize) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          (item) =>
            item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === product.id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [
              ...cartItems,
              { ...product, quantity: 1, selectedColor, selectedSize },
            ],
          });
        }
      },

      removeFromCart: (productId, selectedColor, selectedSize) => {
        set({
          cartItems: get().cartItems.filter(
            (item) =>
              !(
                item.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
              )
          ),
        });
      },

      increaseQuantity: (productId, selectedColor, selectedSize) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (productId, selectedColor, selectedSize) => {
        const cartItems = get().cartItems;
        const item = cartItems.find(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (item && item.quantity > 1) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId, selectedColor, selectedSize);
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

      getItemQuantity: (productId, selectedColor, selectedSize) => {
        const item = get().cartItems.find(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );
        return item ? item.quantity : 0;
      },

      isInCart: (productId, selectedColor, selectedSize) => {
        return get().cartItems.some(
          (item) =>
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

