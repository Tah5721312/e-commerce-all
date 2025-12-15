'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

import type { Product, ProductCategory } from '@/types/product';

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  onSearchChange?: (query: string, category: string) => void;
  showResults?: boolean;
  className?: string;
}

const SearchBar = ({
  initialQuery = '',
  initialCategory = 'all',
  onSearchChange,
  showResults = true,
  className = '',
}: SearchBarProps) => {
  const router = useRouter();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${DOMAIN}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Update search query when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Update selected category when initialCategory changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery.trim(),
        });
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        const response = await fetch(
          `${DOMAIN}/api/products?${params.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data?.slice(0, 5) || []); // Limit to 5 results
          if (showResults) {
            setIsSearchOpen(true);
          }
        }
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, showResults]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        search: searchQuery.trim(),
      });
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      router.push(`/products?${params.toString()}`);
      setIsSearchOpen(false);

      // Call onSearchChange callback if provided
      if (onSearchChange) {
        onSearchChange(searchQuery.trim(), selectedCategory);
      }
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryMenuOpen(false);

    // Call onSearchChange callback if provided
    if (onSearchChange && searchQuery.trim()) {
      onSearchChange(searchQuery.trim(), category);
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSearchSubmit}
        className='flex items-center bg-gray-50 rounded-full sm:rounded-full border border-gray-200 hover:border-[#D23F57] focus-within:border-[#D23F57] focus-within:ring-2 focus-within:ring-[#D23F57]/20 transition-all duration-200'
      >
        <div className='pl-3 sm:pl-4 pr-1 sm:pr-2 flex items-center text-gray-500'>
          <FiSearch className='w-4 h-4 sm:w-5 sm:h-5' />
        </div>

        <input
          type='text'
          placeholder='ابحث عن منتج...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() =>
            searchQuery.trim().length >= 2 &&
            showResults &&
            setIsSearchOpen(true)
          }
          className='flex-1 py-2 sm:py-3 px-1 sm:px-2 outline-none text-xs sm:text-sm bg-transparent placeholder-gray-400'
        />

        <div className='relative'>
          <button
            type='button'
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className='h-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 bg-white rounded-r-full border-l border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-700'
          >
            <span className='whitespace-nowrap'>
              {selectedCategory === 'all'
                ? 'الكل'
                : categories.find((c) => c.slug === selectedCategory)?.name ||
                  'الكل'}
            </span>
            <svg
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${
                isCategoryMenuOpen ? 'rotate-180' : ''
              }`}
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          {isCategoryMenuOpen && (
            <div className='absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-50 w-[180px] sm:min-w-[200px] border border-gray-200 max-h-64 overflow-y-auto'>
              <button
                type='button'
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-right px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#D23F57] text-white hover:bg-[#E0526A]'
                    : 'text-gray-700'
                }`}
              >
                الكل
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type='button'
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`w-full text-right px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-[#D23F57] text-white hover:bg-[#E0526A]'
                      : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isSearchOpen && showResults && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-[60vh] sm:max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='p-3 sm:p-4 text-center text-gray-500'>
              <div className='animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-[#D23F57] mx-auto'></div>
              <p className='mt-2 text-xs sm:text-sm'>جاري البحث...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className='p-2 sm:p-3 border-b border-gray-200 bg-gray-50'>
                <p className='text-xs sm:text-sm font-medium text-gray-700'>
                  نتائج البحث ({searchResults.length})
                </p>
              </div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className='w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 transition-colors text-right border-b border-gray-100 last:border-b-0'
                >
                  {product.productimg && product.productimg.length > 0 && (
                    <img
                      src={
                        product.productimg[0]?.url || '/images/placeholder.jpg'
                      }
                      alt={product.productTitle}
                      className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0'
                    />
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs sm:text-sm font-medium text-gray-900 truncate'>
                      {product.productTitle}
                    </p>
                    <p className='text-xs sm:text-sm text-[#D23F57] font-semibold mt-0.5 sm:mt-1'>
                      ${product.productPrice.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              {searchQuery.trim() && (
                <div className='p-2 sm:p-3 border-t border-gray-200 bg-gray-50'>
                  <button
                    onClick={handleSearchSubmit}
                    className='w-full text-center text-xs sm:text-sm text-[#D23F57] font-medium hover:underline'
                  >
                    عرض جميع النتائج
                  </button>
                </div>
              )}
            </>
          ) : searchQuery.trim().length >= 2 ? (
            <div className='p-3 sm:p-4 text-center text-gray-500'>
              <p className='text-xs sm:text-sm'>لا توجد نتائج</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
