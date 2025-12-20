'use client';

import { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

import type { ProductCategory } from '@/types/product';

interface DashboardSearchBarProps {
  onSearchChange: (query: string, category: string) => void;
  className?: string;
}

const DashboardSearchBar = ({
  onSearchChange,
  className = '',
}: DashboardSearchBarProps) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${DOMAIN}/api/categories?activeOnly=true`);
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

  // Call onSearchChange when search query or category changes
  useEffect(() => {
    onSearchChange(searchQuery, selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryMenuOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className='flex items-center bg-white rounded-lg border border-gray-300 hover:border-primary-500 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200'>
        <div className='pl-4 pr-2 flex items-center text-gray-500'>
          <FiSearch className='w-5 h-5' />
        </div>

        <input
          type='text'
          placeholder='ابحث عن منتج...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-1 py-3 px-2 outline-none text-sm bg-transparent placeholder-gray-400'
        />

        {searchQuery && (
          <button
            type='button'
            onClick={handleClearSearch}
            className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='مسح البحث'
          >
            <FiX className='w-4 h-4' />
          </button>
        )}

        <div className='relative border-l border-gray-300'>
          <button
            type='button'
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className='h-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700'
          >
            <span className='whitespace-nowrap'>
              {selectedCategory === 'all'
                ? 'الكل'
                : categories.find((c) => c.slug === selectedCategory)?.name ||
                  'الكل'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${
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
            <div className='absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-50 min-w-[200px] border border-gray-200 max-h-64 overflow-y-auto'>
              <button
                type='button'
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
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
                  className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSearchBar;

