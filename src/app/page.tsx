'use client';

import * as React from 'react';
import { Suspense, useState } from 'react';

import CartDrawer from '@/components/cart/CartDrawer';
import FavoritesDrawer from '@/components/favorites/FavoritesDrawer';
import Footer from '@/components/footer/Footer';
import Header1 from '@/components/header/Header1';
import Header2 from '@/components/header/Header2';
import Header3 from '@/components/header/Header3';
import Hero from '@/components/hero/Hero';
import ProductList from '@/components/main/ProductList';
import ScrollToTop from '@/components/scroll/ScrollToTop';

export default function HomePage() {
  const [priceRange] = useState<[number, number]>([0, 10000]);
  const [minRating] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSource, setCartSource] = useState<'button' | 'icon'>('icon');
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <main className='min-h-screen bg-white'>
      <Header1 />
      <Header2
        onCartOpen={() => {
          setIsCartOpen(true);
          setCartSource('icon');
        }}
        onFavoritesOpen={() => setIsFavoritesOpen(true)}
      />
      <Header3 />
      <div className='bg-white'>
        <Hero />
        <Suspense
          fallback={
            <div className='container mx-auto px-4 py-8'>
              Loading products...
            </div>
          }
        >
          <ProductList priceRange={priceRange} minRating={minRating} />
        </Suspense>
      </div>
      <Footer />
      <ScrollToTop />

      {/* Drawers rendered at page level to ensure proper z-index */}
      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartSource={cartSource}
      />
      <FavoritesDrawer
        open={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </main>
  );
}
