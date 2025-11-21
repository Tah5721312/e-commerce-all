'use client';

import Image from 'next/image';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onImageClick: () => void;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onImageClick, onAddToCart }: ProductCardProps) => {
  const isInCart = useCartStore((state) => state.isInCart(product.id));
  const itemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  // Ensure image URL starts with / for local images
  const getImageUrl = (url: string) => {
    if (!url) return '/images/default-image.png';
    // Handle external URLs (http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Handle local paths
    if (url.startsWith('/')) {
      return url;
    }
    // Otherwise, prepend /
    return `/${url}`;
  };

  const imageUrl =
    product.productimg && product.productimg[0]?.url
      ? getImageUrl(product.productimg[0].url)
      : '/images/default-image.png';

  return (
    <div className="max-w-[333px] mt-6 group hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <div
        className="relative h-[277px] cursor-pointer overflow-hidden"
        onClick={onImageClick}
      >
        <Image
          src={imageUrl}
          alt={product.productTitle}
          fill
          className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{product.productTitle}</h3>
          <p className="text-lg font-medium">${product.productPrice}</p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </p>

        <div className="flex justify-between items-center">
          {isInCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => increaseQuantity(product.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiPlus className="w-4 h-4 text-primary-500" />
              </button>
              <span className="w-8 text-center font-bold text-primary-500">
                {itemQuantity}
              </span>
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiMinus className="w-4 h-4 text-primary-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAddToCart}
              className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors capitalize"
            >
              <FiShoppingCart className="w-4 h-4" />
              Add to cart
            </button>
          )}

          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.productRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

