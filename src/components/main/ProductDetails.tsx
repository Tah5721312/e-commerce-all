'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const isInCart = useCartStore((state) => state.isInCart(product.id));
  const itemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  if (!product || !product.productimg || product.productimg.length === 0) {
    return null;
  }

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

  const currentImage = 
    getImageUrl(
      product.productimg[selectedImg]?.url || 
      product.productimg[0]?.url || 
      '/images/default-image.png'
    );

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-5 sm:mt-0">
      <div className="flex">
        <Image
          src={currentImage}
          alt={product.productTitle}
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      <div className="py-2 text-center sm:text-left">
        <h5 className="text-lg capitalize">{product.category}</h5>
        <p className="my-1 text-[22px] text-crimson font-semibold">
          ${product.productPrice}
        </p>
        <p className="text-base mb-4">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </p>

        <div className="flex justify-center sm:justify-start gap-1 my-2">
          {product.productimg.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImg(index)}
              className={`w-[110px] h-[110px] p-0 mx-1 border-2 rounded transition-all ${
                selectedImg === index
                  ? 'border-primary-500 opacity-100'
                  : 'border-gray-300 opacity-50 hover:opacity-75'
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
                width={110}
                height={110}
                className="rounded w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {isInCart ? (
          <div className="flex items-center justify-center sm:justify-start gap-1">
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
            onClick={() => addToCart(product)}
            className="mb-1 sm:mb-1 px-5 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors capitalize flex items-center gap-2"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

