'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductList from '@/components/main/ProductList';
import FilterSidebar from '@/components/filters/FilterSidebar';
import SearchBar from '@/components/search/SearchBar';
import { DOMAIN } from '@/lib/constants';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Get search query and category from URL
  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || 'all';

  // Fetch max price from products
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        // Fetch all products to calculate max price
        const response = await fetch(`${DOMAIN}/api/products`);
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
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

          {/* Right Side - Search Bar and Products */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Search Bar */}
            <div>
              <SearchBar
                initialQuery={searchQuery}
                initialCategory={categorySlug}
                showResults={true}
                className="w-full"
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductList priceRange={priceRange} minRating={minRating} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

