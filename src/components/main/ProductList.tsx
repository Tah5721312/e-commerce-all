'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductCategory, ProductSize } from '@/types/product';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSource, setCartSource] = useState<'button' | 'icon'>('icon');

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryParam =
        selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
      const response = await fetch(`/api/products${categoryParam}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToCart = (
    product: Product,
    colorId?: number | null,
    size?: ProductSize | null
  ) => {
    const hasVariants = product.colors && product.colors.length > 0;

    if (hasVariants) {
      // لو اللون والمقاس متوفرين نضيف مباشرة ونفتح السلة
      if (colorId && size) {
        addToCart(product, colorId, size);
        setIsCartOpen(true);
        setCartSource('button');
        setTimeout(() => {
          setIsCartOpen(false);
          setCartSource('icon');
        }, 1700);
      } else {
        // لو لسه في اختيارات ناقصة نفتح الـ modal مع تمرير الموجود
        setSelectedProduct(product);
        setSelectedColorId(colorId ?? null);
        setSelectedSize(size ?? null);
        setIsDetailsOpen(true);
      }
    } else {
      // المنتجات بدون مقاسات تضاف مباشرة ونفتح السلة
      addToCart(product);
      setIsCartOpen(true);
      setCartSource('button');
      setTimeout(() => {
        setIsCartOpen(false);
        setCartSource('icon');
      }, 1700);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-9">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Selected Products</h2>
          <p className="text-gray-600 font-light">
            All our new arrivals in a exclusive brand selection
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border border-gray-300 rounded p-1">
          {[
            { value: 'all', label: 'All Products' },
            { value: 'men', label: 'Men' },
            { value: 'women', label: 'Women' },
            { value: 'children', label: 'Children' },
            { value: 'accessories', label: 'Accessories' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'beauty', label: 'Beauty' },
            { value: 'home', label: 'Home' },
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors ${selectedCategory === category.value
                ? 'bg-primary-50 border border-primary-500 text-primary-600'
                : 'hover:bg-gray-50'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onImageClick={(colorId, size) => handleProductClick(product, colorId, size)}
            onAddToCart={(colorId, size) => handleAddToCart(product, colorId, size)}
          />
        ))}
      </div>

      {isDetailsOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 max-w-6xl w-full max-h-[96vh] overflow-hidden relative shadow-2xl flex flex-col animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">Product Details</h3>
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

            {/* Content area with scroll */}
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

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartSource={cartSource}
      />
      <CartButton onClick={() => {
        setIsCartOpen(true);
        setCartSource('icon');
      }} />
    </div>
  );
};

export default ProductList;

