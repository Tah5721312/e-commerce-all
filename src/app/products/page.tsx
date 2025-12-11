'use client';

import { useState } from 'react';
import ProductList from '@/components/main/ProductList';
import FilterSidebar from '@/components/filters/FilterSidebar';

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Left */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minRating={minRating}
              onRatingChange={setMinRating}
              maxPrice={10000}
            />
          </div>

          {/* Products Grid - Right */}
          <div className="flex-1 min-w-0">
            <ProductList priceRange={priceRange} minRating={minRating} />
          </div>
        </div>
      </div>
    </main>
  );
}

