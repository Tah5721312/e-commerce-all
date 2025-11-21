'use client';

import * as React from 'react';
import Header1 from '@/components/header/Header1';
import Header2 from '@/components/header/Header2';
import Header3 from '@/components/header/Header3';
import Hero from '@/components/hero/Hero';
import Footer from '@/components/footer/Footer';
import ScrollToTop from '@/components/scroll/ScrollToTop';
import ProductList from '@/components/main/ProductList';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header1 />
      <Header2 />
      <Header3 />
      <div className="bg-white">
        <Hero />
        <ProductList />
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
