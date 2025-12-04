'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/favoritesStore';
import ProductCard from '@/components/main/ProductCard';
import ProductDetails from '@/components/main/ProductDetails';
import type { Product, ProductSize } from '@/types/product';

const FavoritesPage = () => {
  const favorites = useFavoritesStore((state) => state.favorites);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleProductClick = (
    product: Product,
    colorId?: number | null,
    size?: ProductSize | null
  ) => {
    const fallbackColor =
      product.colors && product.colors.length > 0 ? product.colors[0].id : null;

    setSelectedProduct(product);
    setSelectedColorId(colorId !== undefined ? colorId : fallbackColor);
    setSelectedSize(size !== undefined ? size : null);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-9">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">المفضلة</h2>
          <p className="text-gray-600 font-light">
            المنتجات التي قمت بإضافتها إلى قائمة المفضلة
          </p>
        </div>

        {/* زر الرجوع للصفحة الرئيسية */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span>الرجوع للرئيسية</span>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          لا توجد منتجات في المفضلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onImageClick={(colorId, size) =>
                handleProductClick(product, colorId, size)
              }
              onAddToCart={(colorId, size) =>
                handleProductClick(product, colorId, size)
              }
            />
          ))}
        </div>
      )}

      {isDetailsOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 max-w-6xl w-full max-h-[96vh] overflow-hidden relative shadow-2xl flex flex-col animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                تفاصيل المنتج
              </h3>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <ProductDetails
                product={selectedProduct}
                initialColorId={selectedColorId}
                initialSize={selectedSize}
                onSelectionChange={(colorId, size) => {
                  setSelectedColorId(colorId);
                  setSelectedSize(size);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;


