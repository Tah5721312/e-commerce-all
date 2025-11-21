'use client';

import { useEffect, useState } from 'react';
import { FiX, FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartSource: 'button' | 'icon';
}

const CartDrawer = ({ open, onClose, cartSource }: CartDrawerProps) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (open) {
      setSlideIn(true);
      if (cartSource !== 'icon') {
        const timer = setTimeout(() => {
          setSlideIn(false);
          setTimeout(() => {
            onClose();
          }, 500);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setSlideIn(false);
    }
  }, [open, onClose, cartSource]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-[750px] bg-white p-4 md:p-6 shadow-xl transition-transform duration-500 ${
          slideIn ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:text-red-500 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 mt-8">
          <h2 className="text-2xl md:text-4xl flex items-center justify-center gap-2">
            <FiShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6" />

        {cartItems.length === 0 ? (
          <p className="text-center">The cart is empty...</p>
        ) : (
          <div>
            <div className="hidden md:flex text-center mb-2 px-1 font-bold text-sm">
              <div className="flex-[0.2] text-left">Image</div>
              <div className="flex-[0.2]">Name</div>
              <div className="flex-[0.19]">Quantity</div>
              <div className="flex-[0.2]">Price</div>
              <div className="flex-[0.2]">Remove</div>
            </div>
            <div className="border-b border-gray-300 mb-2" />

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-300 py-2 px-1 mb-2"
              >
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <div className="flex-[0.2]">
                    {item.productimg && item.productimg[0] && (
                      <Image
                        src={
                          item.productimg[0].url.startsWith('http://') ||
                          item.productimg[0].url.startsWith('https://')
                            ? item.productimg[0].url
                            : item.productimg[0].url.startsWith('/')
                            ? item.productimg[0].url
                            : `/${item.productimg[0].url}`
                        }
                        alt={item.productTitle}
                        width={50}
                        height={50}
                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex-[0.2] text-center md:text-left">
                    <p className="text-sm font-medium truncate">
                      {item.productTitle}
                    </p>
                  </div>

                  <div className="flex-[0.2] flex items-center justify-center gap-2">
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-[0.2] text-center">
                    <p className="text-sm">${item.productPrice.toFixed(2)}</p>
                  </div>

                  <div className="flex-[0.2] text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Remove item"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center mt-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mt-2"
              >
                Clear Cart
              </button>
            </div>

            <div className="mt-6">
              <div className="flex flex-col md:flex-row gap-2 items-center md:items-start">
                <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors text-sm md:text-base">
                  Checkout
                </button>
                <p className="text-xl md:text-2xl font-semibold text-center md:text-left mt-2 md:mt-0">
                  Total: ${getTotal().toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2 mt-4 justify-center md:justify-start">
                <Image
                  src="/images/visa.png"
                  alt="Visa"
                  width={25}
                  height={20}
                  className="h-5 md:h-6"
                />
                <Image
                  src="/images/mastercard.png"
                  alt="Mastercard"
                  width={25}
                  height={20}
                  className="h-5 md:h-6"
                />
                <Image
                  src="/images/paypal.png"
                  alt="PayPal"
                  width={25}
                  height={20}
                  className="h-5 md:h-6"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

