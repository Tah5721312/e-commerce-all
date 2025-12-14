'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
  initialColorId?: number | null;
  initialSizeId?: number | null;
  // لإبلاغ الـ Parent بأي تغيير في اللون أو المقاس
  onSelectionChange?: (colorId: number | null, sizeId: number | null) => void;
}

const ProductDetails = ({
  product,
  initialColorId,
  initialSizeId,
  onSelectionChange,
}: ProductDetailsProps) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number | null>(
    initialColorId !== undefined && initialColorId !== null
      ? initialColorId
      : product.colors && product.colors.length > 0
        ? product.colors[0].id
        : null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
    initialSizeId || null
  );

  // مزامنة اللون/المقاس عند تغيير المدخلات أو المنتج
  useEffect(() => {
    if (initialColorId === undefined) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].id);
      } else {
        setSelectedColor(null);
      }
    } else {
      setSelectedColor(initialColorId);
    }
  }, [product.id, product.colors, initialColorId]);

  useEffect(() => {
    if (initialSizeId === undefined) {
      setSelectedSizeId(null);
    } else {
      setSelectedSizeId(initialSizeId);
    }
  }, [product.id, initialSizeId]);

  const selectedColorData = useMemo(() => {
    if (!selectedColor || !product.colors) return null;
    return product.colors.find((c) => c.id === selectedColor);
  }, [selectedColor, product.colors]);

  const availableSizes = useMemo(() => {
    if (!selectedColorData) return [];
    return selectedColorData.variants
      .filter((v) => v.quantity > 0)
      .map((v) => v.size)
      .filter((size, index, self) => 
        index === self.findIndex((s) => s.id === size.id)
      );
  }, [selectedColorData]);

  const getSizeQuantity = (sizeId: number) => {
    if (!selectedColorData) return 0;
    const variant = selectedColorData.variants.find((v) => v.size?.id === sizeId);
    return variant?.quantity || 0;
  };

  const isInCart = useCartStore((state) =>
    state.isInCart(product.id, selectedColor || undefined, selectedSizeId || undefined)
  );
  const itemQuantity = useCartStore((state) =>
    state.getItemQuantity(product.id, selectedColor || undefined, selectedSizeId || undefined)
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const getAvailableQuantity = () => {
    // If product has no colors at all, get quantity from product itself
    if (!product.colors || product.colors.length === 0) {
      return product.quantity ?? null;
    }
    
    if (!selectedColorData) return null;
    
    // If product has sizes, get quantity from variant
    if (selectedSizeId) {
      const variant = selectedColorData.variants.find((v) => v.size?.id === selectedSizeId);
      return variant?.quantity ?? null;
    }
    
    // If product has no sizes, get quantity from color itself
    if (availableSizes.length === 0) {
      return (selectedColorData as any).quantity ?? null;
    }
    
    return null;
  };

  if (!product || !product.productimg || product.productimg.length === 0) {
    return null;
  }

  // Ensure image URL is properly formatted
  const getImageUrl = (url: string) => {
    if (!url || url.trim() === '') return '/images/default-image.png';

    // Handle external URLs (http/https) - return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Handle localhost URLs
    if (url.includes('localhost:3000')) {
      return url;
    }

    // Handle local paths - ensure it starts with /
    if (url.startsWith('/')) {
      return url;
    }

    // If it doesn't start with /, add it
    return `/${url}`;
  };

  const currentImage =
    getImageUrl(
      product.productimg[selectedImg]?.url ||
      product.productimg[0]?.url ||
      '/images/default-image.png'
    );

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
      {/* Image Section */}
      <div className="flex-shrink-0 w-full lg:w-[45%]">
        <div className="sticky top-0">
          <div className="relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-3 md:p-4">
            <Image
              src={currentImage}
              alt={product.productTitle}
              width={500}
              height={500}
              className="rounded-lg object-cover w-full aspect-square"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-image.png';
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {product.productimg.length > 1 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.productimg.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImg(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 p-1 border-2 rounded-lg transition-all overflow-hidden bg-gray-50 ${selectedImg === index
                      ? 'border-primary-500 ring-2 ring-primary-200 opacity-100 scale-105'
                      : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-gray-400'
                      }`}
                  >
                    <Image
                      src={
                        img.url.startsWith('http://') || img.url.startsWith('https://')
                          ? img.url
                          : img.url.startsWith('/')
                            ? img.url
                            : `/${img.url}`
                      }
                      alt={`product-img-${index}`}
                      width={80}
                      height={80}
                      className="rounded-md w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-image.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 w-full lg:w-[55%] space-y-6">
        {/* Product Info */}
        <div>
          <div className="mb-3">
            <span className="inline-block px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold capitalize">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.productTitle}
          </h2>
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <p className="text-3xl md:text-4xl text-primary-500 font-bold">
              ${product.productPrice}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.productRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviews && product.reviews.length > 0 && (
                <span className="text-sm text-gray-600">
                  ({product.reviews.length})
                </span>
              )}
            </div>
            <a
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              عرض التقييمات والتعليقات
            </a>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            {product.productDiscription || 'Premium quality product with excellent design and comfort'}
          </p>
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              اختر اللون / Select Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    const newColor = color.id;
                    setSelectedColor(newColor);
                    setSelectedSizeId(null);
                    onSelectionChange?.(newColor, null);
                  }}
                  className={`px-4 py-2.5 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${selectedColor === color.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  style={{
                    backgroundColor: selectedColor === color.id ? color.colorCode + '15' : 'white',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <span className="text-sm font-medium text-gray-700">{color.colorName}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {selectedColorData && availableSizes.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              اختر المقاس / Select Size
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {availableSizes.map((size) => {
                const quantity = getSizeQuantity(size.id);
                const isAvailable = quantity > 0;
                return (
                  <button
                    key={size.id}
                    onClick={() => {
                      if (!isAvailable) return;
                      setSelectedSizeId(size.id);
                      onSelectionChange?.(selectedColor, size.id);
                    }}
                    disabled={!isAvailable}
                    className={`px-5 py-2.5 rounded-lg border-2 transition-all font-medium text-sm shadow-sm hover:shadow-md ${selectedSizeId === size.id
                      ? 'border-primary-500 bg-primary-500 text-white ring-2 ring-primary-200'
                      : isAvailable
                        ? 'border-gray-300 hover:border-primary-300 bg-white text-gray-700 hover:bg-primary-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{size.displayName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}


        {/* Add to Cart Section */}
        <div className="border-t border-gray-200 pt-6">
          {(!product.colors || product.colors.length === 0 || (selectedColorData && (availableSizes.length === 0 || selectedSizeId))) ? (
            isInCart ? (
              <div className="flex items-center justify-center sm:justify-start gap-4 bg-primary-50 px-6 py-4 rounded-xl border border-primary-200">
                {(() => {
                  const availableQuantity = getAvailableQuantity();
                  const isMax = availableQuantity !== null && itemQuantity >= availableQuantity;
                  return (
                    <>
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            product.id,
                            selectedColor || undefined,
                            selectedSizeId || undefined
                          )
                        }
                        className="p-2 hover:bg-primary-100 rounded-full transition-colors"
                      >
                        <FiMinus className="w-5 h-5 text-primary-600" />
                      </button>
                      <span className="w-12 text-center font-bold text-primary-600 text-xl">
                        {itemQuantity}
                      </span>
                      {availableQuantity !== null && (
                        <span className="text-xs text-gray-500">
                          / {availableQuantity}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          const availableQuantity = getAvailableQuantity();
                          if (availableQuantity !== null && itemQuantity < availableQuantity) {
                            increaseQuantity(
                              product.id,
                              selectedColor || undefined,
                              selectedSizeId || undefined
                            );
                          }
                        }}
                        disabled={isMax}
                        className={`p-2 rounded-full transition-colors ${
                          isMax
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-primary-100'
                        }`}
                      >
                        <FiPlus className={`w-5 h-5 text-primary-600 ${isMax ? 'opacity-50' : ''}`} />
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <button
                onClick={() =>
                  addToCart(
                    product,
                    selectedColor || undefined,
                    selectedSizeId || undefined
                  )
                }
                className="w-full px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl capitalize flex items-center justify-center gap-3 font-semibold text-base"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to cart
              </button>
            )
          ) : (
            <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 text-center">
              {product.colors && product.colors.length > 0 && !selectedColorData
                ? '⚠️ يرجى اختيار لون أولاً'
                : product.colors && product.colors.length > 0 && availableSizes.length > 0 && !selectedSizeId
                  ? '⚠️ يرجى اختيار مقاس'
                  : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

