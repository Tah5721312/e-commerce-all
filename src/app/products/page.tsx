'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/components/main/ProductList';
import FilterSidebar from '@/components/filters/FilterSidebar';

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Fetch max price from products
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        // Fetch all products to calculate max price
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            // Find the maximum price from all products
            const prices = data.data.map((p: { productPrice: number | string }) => 
              Number(p.productPrice)
            );
            const max = Math.max(...prices);
            
            // Round up to nearest 50 for better UX (e.g., 199.99 -> 200, 129.99 -> 150)
            const roundedMax = Math.ceil(max / 50) * 50;
            const finalMax = roundedMax > 0 ? roundedMax : 1000; // Minimum 1000 if no products
            
            setMaxPrice(finalMax);
            setPriceRange([0, finalMax]);
          }
        }
      } catch (error) {
        console.error('Error fetching max price:', error);
        // Fallback to a reasonable default
        setMaxPrice(1000);
        setPriceRange([0, 1000]);
      }
    };

    fetchMaxPrice();
  }, []);

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
              maxPrice={maxPrice}
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

