'use client';

import { useMemo, useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

import { useFavoritesStore } from '@/store/favoritesStore';

import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onImageClick: () => void;
  onAddToCart: () => void;
}

// دالة مساعدة لمعالجة URL الصور بشكل صحيح
const getImageUrl = (url: string): string => {
  if (!url || url.trim() === '') return '/images/default-image.png';

  // إذا كان URL كامل (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // إذا كان localhost
  if (url.includes('localhost')) {
    return url;
  }

  // إذا كان مسار محلي
  if (url.startsWith('/')) {
    return url;
  }

  // إضافة / في البداية
  return `/${url}`;
};

const ProductCard = ({
  product,
  onImageClick,
  onAddToCart,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  // معالجة URL الصورة
  const imageUrl = useMemo(() => {
    if (
      product.productimg &&
      product.productimg.length > 0 &&
      product.productimg[0]?.url
    ) {
      return getImageUrl(product.productimg[0].url);
    }
    return '/images/default-image.png';
  }, [product.productimg]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className='max-w-[333px] mt-6 group hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white border border-gray-100'>
      <div
        className='relative h-[277px] cursor-pointer overflow-hidden bg-gray-100'
        onClick={onImageClick}
      >
        {/* Placeholder أثناء التحميل */}
        {imageLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse'>
            <svg
              className='w-16 h-16 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}

        {/* الصورة الفعلية */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt={product.productTitle}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading='lazy'
          />
        ) : (
          // صورة افتراضية في حالة الخطأ
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
            <div className='text-center p-4'>
              <svg
                className='w-20 h-20 mx-auto text-gray-400 mb-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='text-xs text-gray-500'>صورة غير متوفرة</p>
            </div>
          </div>
        )}

        {/* طبقة شفافة خفيفة عند الـ hover (متوافقة مع Tailwind v4) */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none' />
      </div>

      <div className='p-5'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-semibold text-gray-800 flex-1 pr-2 line-clamp-2'>
            {product.productTitle}
          </h3>
          <p className='text-xl font-bold text-primary-500 whitespace-nowrap'>
            ${product.productPrice}
          </p>
        </div>
        {/* 
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.productDiscription || 'منتج عالي الجودة بتصميم ممتاز وراحة فائقة'}
        </p> */}

        {/* تقييم النجوم */}
        <div className='flex items-center gap-1.5 mb-4'>
          <div className='flex items-center gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.productRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
          {product.reviews && product.reviews.length > 0 && (
            <span className='text-xs text-gray-500'>
              ({product.reviews.length})
            </span>
          )}
        </div>

        <div className='flex items-center gap-2 pt-3 border-t border-gray-100'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg capitalize font-medium text-xs sm:text-sm whitespace-nowrap'
          >
            <FiShoppingCart className='w-4 h-4' />
            Add to cart
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isFavorite) {
                removeFavorite(product.id);
              } else {
                addFavorite(product);
              }
            }}
            className={`p-2 rounded-lg border transition-colors ${
              isFavorite
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200'
            }`}
            aria-label='Toggle favorite'
            title={isFavorite ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
          >
            <FiHeart
              className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageClick();
            }}
            className='px-4 py-2 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap'
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
