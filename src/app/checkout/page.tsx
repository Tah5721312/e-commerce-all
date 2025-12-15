'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

import PaymentForm from '@/components/checkout/PaymentForm';

import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const getTotal = useCartStore((state) => state.getTotal);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems.length, router]);

  if (!isClient) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return null;
  }

  const total = getTotal();

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
          >
            <FiArrowLeft className='w-5 h-5' />
            <span>Back to Cart</span>
          </button>
          <h1 className='text-3xl md:text-4xl font-bold flex items-center gap-2'>
            <FiShoppingCart className='w-8 h-8' />
            Checkout
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
              <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
              <div className='space-y-4 mb-6'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex gap-4 border-b pb-4'>
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
                        width={80}
                        height={80}
                        className='w-20 h-20 object-cover rounded'
                      />
                    )}
                    <div className='flex-1'>
                      <h3 className='font-semibold text-sm'>
                        {item.productTitle}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        Quantity: {item.quantity}
                      </p>
                      <p className='text-gray-800 font-medium mt-1'>
                        ${(item.productPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='border-t pt-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-semibold'>${total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-semibold'>$0.00</span>
                </div>
                <div className='flex justify-between items-center text-xl font-bold pt-2 border-t'>
                  <span>Total</span>
                  <span className='text-purple-600'>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-6'>Payment Details</h2>
              <PaymentForm total={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
