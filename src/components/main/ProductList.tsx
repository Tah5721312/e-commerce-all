'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductCategory } from '@/types/product';
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
    setCartSource('button');
    setTimeout(() => {
      setIsCartOpen(false);
      setCartSource('icon');
    }, 1700);
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

        <div className="flex gap-2 border border-gray-300 rounded">
          {[
            { value: 'all', label: 'All Products' },
            { value: 'men', label: 'MEN category' },
            { value: 'women', label: 'Women category' },
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedCategory === category.value
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
            onImageClick={() => handleProductClick(product)}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {isDetailsOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:text-red-500 hover:rotate-180 transition-all"
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
            <ProductDetails product={selectedProduct} />
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

