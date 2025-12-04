'use client';

import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiSettings, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import CartDrawer from '@/components/cart/CartDrawer';
import FavoritesDrawer from '@/components/favorites/FavoritesDrawer';

const Header2 = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSource, setCartSource] = useState<'button' | 'icon'>('icon');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  const categories = ['All Categories', 'Car', 'Clothes', 'Electronics'];

  return (
    <div className="container mx-auto px-4 my-2 flex justify-between items-center">
      <div className="hidden sm:flex flex-col items-center">
        <FiShoppingCart className="w-6 h-6" />
        <span className="text-sm">E-Commerce</span>
      </div>

      <div className="flex items-center border border-gray-400 rounded-[22px] flex-1 max-w-md hover:border-gray-600 transition-colors">
        <div className="pl-3 pr-2 flex items-center">
          <FiSearch className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 py-2 px-2 outline-none text-sm"
        />
        <div className="relative">
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="bg-gray-100 rounded-r-[22px] px-4 py-2 text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors"
          >
            <span>{categories[selectedCategory]}</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isCategoryMenuOpen && (
            <div className="absolute right-0 mt-1 bg-white rounded shadow-lg z-10 min-w-[150px]">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(index);
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCategory === index ? 'bg-gray-50' : ''
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* زر المفضلة (يفتح Drawer) */}
        <button
          onClick={() => setIsFavoritesOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="favorites"
          title="Favorites"
        >
          <FiHeart className="w-6 h-6" />
          {favoritesCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* زر السلة */}
        <button
          onClick={() => {
            setIsCartOpen(true);
            setCartSource('icon');
          }}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="cart"
        >
          <FiShoppingCart className="w-6 h-6" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartItems.length}
            </span>
          )}
        </button>
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="dashboard"
          title="Dashboard"
        >
          <FiSettings className="w-6 h-6" />
        </Link>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="user"
        >
          <FiUser className="w-6 h-6" />
        </button>
      </div>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartSource={cartSource}
      />
      <FavoritesDrawer open={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </div>
  );
};

export default Header2;

