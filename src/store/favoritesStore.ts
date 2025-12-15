'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Product } from '@/types/product';

interface FavoritesStore {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        const favorites = get().favorites;
        if (favorites.some((item) => item.id === product.id)) return;
        set({ favorites: [...favorites, product] });
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((item) => item.id !== productId),
        });
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
