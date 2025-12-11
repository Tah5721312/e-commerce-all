'use client';

import { useState } from 'react';
import { FiSliders } from 'react-icons/fi';

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  maxPrice?: number;
}

const FilterSidebar = ({
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  maxPrice = 10000,
}: FilterSidebarProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [localRating, setLocalRating] = useState(minRating);

  const handleApplyFilters = () => {
    onPriceChange(localPriceRange);
    onRatingChange(localRating);
  };

  const handleRatingSelect = (rating: number) => {
    setLocalRating(rating);
  };

  const handleReset = () => {
    setLocalPriceRange([0, maxPrice]);
    setLocalRating(0);
    onPriceChange([0, maxPrice]);
    onRatingChange(0);
  };

  return (
    <aside className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-8 flex flex-col max-h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 px-6 pt-6 flex-shrink-0">
        <FiSliders className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Content - Scrollable */}
      <div className="space-y-8 overflow-y-auto px-6 flex-1">
        {/* Price Range Filter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
            <span className="text-xs font-medium text-primary-500">
              ${localPriceRange[0]} - ${localPriceRange[1]}
            </span>
          </div>

          <div className="space-y-4">
            {/* Min Price */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">Min Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={localPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  if (newMin <= localPriceRange[1]) {
                    setLocalPriceRange([newMin, localPriceRange[1]]);
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <input
                type="number"
                min="0"
                max={maxPrice}
                value={localPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  if (newMin <= localPriceRange[1]) {
                    setLocalPriceRange([newMin, localPriceRange[1]]);
                  }
                }}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">Max Price</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={localPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  if (newMax >= localPriceRange[0]) {
                    setLocalPriceRange([localPriceRange[0], newMax]);
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <input
                type="number"
                min="0"
                max={maxPrice}
                value={localPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  if (newMax >= localPriceRange[0]) {
                    setLocalPriceRange([localPriceRange[0], newMax]);
                  }
                }}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Minimum Rating</h3>
            <span className="text-xs font-medium text-primary-500">{localRating}★</span>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1, 0].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={localRating === rating}
                  onChange={() => handleRatingSelect(rating)}
                  className="w-4 h-4 text-primary-500 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                  {rating === 0 ? (
                    'All Ratings'
                  ) : (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">& up</span>
                    </>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3 mt-8 pt-6 border-t border-gray-200 px-6 pb-6 flex-shrink-0">
        <button
          onClick={handleApplyFilters}
          className="w-full px-4 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
