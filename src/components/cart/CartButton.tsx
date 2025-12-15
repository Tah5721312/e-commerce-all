'use client';

import { FiShoppingCart } from 'react-icons/fi';

interface CartButtonProps {
  onClick: () => void;
}

const CartButton = ({ onClick }: CartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-8 left-8 z-40 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors'
      aria-label='cart'
    >
      <FiShoppingCart className='w-6 h-6' />
    </button>
  );
};

export default CartButton;
