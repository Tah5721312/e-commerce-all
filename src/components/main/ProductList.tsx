'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductCategory, ProductSize } from '@/types/product';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';

interface ProductListProps {
  priceRange: [number, number];
  minRating: number;
}

const ProductList = ({ priceRange, minRating }: ProductListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSource, setCartSource] = useState<'button' | 'icon'>('icon');

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, minRating]);

  // Sync selected category with URL query (?category=slug)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    setSelectedCategory((prev) => (prev !== urlCategory ? urlCategory : prev));
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (priceRange[0] > 0 || priceRange[1] < 10000) {
        params.append('minPrice', String(priceRange[0]));
        params.append('maxPrice', String(priceRange[1]));
      }
      if (minRating > 0) {
        params.append('minRating', String(minRating));
      }

      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
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
    const fallbackColor =
      product.colors && product.colors.length > 0 ? product.colors[0].id : null;

    setSelectedProduct(product);
    setSelectedColorId(fallbackColor);
    setSelectedSize(null);
    setIsDetailsOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    const hasVariants = product.colors && product.colors.length > 0;

    if (hasVariants) {
      // لو فيه ألوان ومقاسات نفتح الـ modal للاختيار
      const fallbackColor =
        product.colors && product.colors.length > 0 ? product.colors[0].id : null;
      setSelectedProduct(product);
      setSelectedColorId(fallbackColor);
      setSelectedSize(null);
      setIsDetailsOpen(true);
    } else {
      // المنتجات بدون ألوان ومقاسات تضاف مباشرة ونفتح السلة
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
        {pathname !== '/products' && (
          <div>
            <h2 className="text-xl font-semibold">Selected Products</h2>
            <p className="text-gray-600 font-light">
              All our new arrivals in a exclusive brand selection
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border border-gray-300 rounded p-1 items-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
              router.replace(pathname);
            }}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors ${selectedCategory === 'all'
              ? 'bg-primary-50 border border-primary-500 text-primary-600'
              : 'hover:bg-gray-50'
              }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.slug);
                router.replace(`${pathname}?category=${category.slug}`);
              }}
              className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors ${selectedCategory === category.slug
                ? 'bg-primary-50 border border-primary-500 text-primary-600'
                : 'hover:bg-gray-50'
                }`}
            >
              {category.name}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm p-4 animate-fadeIn"
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

