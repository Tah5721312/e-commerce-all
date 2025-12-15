'use client';

import Link from 'next/link';
import { FiHeart, FiSettings, FiShoppingCart, FiUser } from 'react-icons/fi';

import SearchBar from '@/components/search/SearchBar';

import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';

import AuthButtons from './AuthButtons';

interface Header2Props {
  onCartOpen?: () => void;
  onFavoritesOpen?: () => void;
}

const Header2 = ({ onCartOpen, onFavoritesOpen }: Header2Props) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  return (
    <header
      className='bg-white shadow-sm sticky top-0 z-20'
      style={{ zIndex: 20 }}
    >
      <div className='container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4'>
        {/* Logo Section */}
        <Link
          href='/'
          className='flex flex-col items-center hover:opacity-80 transition-opacity'
        >
          <FiShoppingCart className='w-6 h-6 text-[#D23F57]' />
          <span className='text-lg font-bold text-gray-800'>E-Commerce</span>
        </Link>

        {/* Search Bar */}
        <SearchBar className='w-full sm:max-w-2xl' />

        {/* Icons Section */}
        <div className='flex items-center gap-3'>
          <button
            onClick={() => onFavoritesOpen?.()}
            className='relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
            aria-label='favorites'
            title='المفضلة'
          >
            <FiHeart className='w-5 h-5 text-gray-600 group-hover:text-[#D23F57] transition-colors' />
            {favoritesCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1'>
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onCartOpen?.()}
            className='relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
            aria-label='cart'
            title='سلة التسوق'
          >
            <FiShoppingCart className='w-5 h-5 text-gray-600 group-hover:text-[#D23F57] transition-colors' />
            {cartItems.length > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1'>
                {cartItems.length}
              </span>
            )}
          </button>

          <Link
            href='/dashboard'
            className='p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
            aria-label='dashboard'
            title='لوحة التحكم'
          >
            <FiSettings className='w-5 h-5 text-gray-600 group-hover:text-[#D23F57] transition-colors' />
          </Link>

          {/* Auth Buttons */}
          <AuthButtons />
          
          <button
            className='p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
            aria-label='user'
            title='حسابي'
          >
            <FiUser className='w-5 h-5 text-gray-600 group-hover:text-[#D23F57] transition-colors' />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header2;
