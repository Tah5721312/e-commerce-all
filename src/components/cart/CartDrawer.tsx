'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore, type CartItem } from '@/store/cartStore';
import Image from 'next/image';
import { DOMAIN } from '@/lib/constants';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartSource: 'button' | 'icon';
}

interface Size {
  id: number;
  size: string;
}

interface Color {
  id: number;
  colorName: string;
  colorCode: string;
}

type CartItemWithDetails = CartItem & {
  sizes?: Size[];
  colors?: Color[];
}

const CartDrawer = ({ open, onClose, cartSource }: CartDrawerProps) => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems) as CartItemWithDetails[];
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const [slideIn, setSlideIn] = useState(false);
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});

  // جلب الكميات المتاحة من قاعدة البيانات
  useEffect(() => {
    const fetchQuantities = async () => {
      const quantities: Record<string, number> = {};

      for (const item of cartItems) {
        if (item.selectedColor && item.selectedSizeId) {
          try {
            const response = await fetch(`${DOMAIN}/api/products/variants/get-quantity`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productColorId: item.selectedColor,
                sizeId: item.selectedSizeId,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const key = `${item.id}-${item.selectedColor}-${item.selectedSizeId}`;
              quantities[key] = data.quantity;
            }
          } catch (error) {
            console.error('Error fetching quantity:', error);
          }
        }
      }

      setVariantQuantities(quantities);
    };

    if (cartItems.length > 0) {
      fetchQuantities();
    }
  }, [cartItems]);

  const getAvailableQuantity = (item: { id: number; selectedColor?: number; selectedSizeId?: number | null }) => {
    if (!item.selectedColor || !item.selectedSizeId) return null;
    const key = `${item.id}-${item.selectedColor}-${item.selectedSizeId}`;
    return variantQuantities[key] ?? null;
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

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
    <div 
      className="fixed inset-0 overflow-hidden" 
      style={{ zIndex: 9999, position: 'fixed' }}
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-[750px] bg-white p-4 md:p-6 shadow-xl transition-transform duration-500 ${slideIn ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="إغلاق سلة التسوق"
          title="إغلاق"
        >
          <FiX className="w-6 h-6 text-gray-600 hover:text-red-500" />
        </button>

        <div className="text-center mb-6 mt-8 flex-shrink-0">
          <h2 className="text-2xl md:text-4xl flex items-center justify-center gap-2">
            <FiShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6 flex-shrink-0" />

        {/* منطقة المحتوى الرئيسية - قابلة للتمرير */}
        <div className="flex-1 overflow-y-auto pr-1">
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

              {cartItems.map((item) => {
                const availableQuantity = getAvailableQuantity(item);
                const isMaxQuantity = availableQuantity !== null && item.quantity >= availableQuantity;
                const exceedsAvailable = availableQuantity !== null && item.quantity > availableQuantity;

                return (
                  <div
                    key={`${item.id}-${item.selectedColor ?? 'noColor'}-${item.selectedSizeId ?? 'noSize'}`}
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
                        {(item.selectedColor || item.selectedSizeId) && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {item.selectedColor && (
                              <span>
                                {item.colors?.find((c) => c.id === item.selectedColor)?.colorName ||
                                  'Color'}
                              </span>
                            )}
                            {item.selectedSizeId && (
                              <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                                {item.selectedSizeId}
                              </span>
                            )}
                          </div>
                        )}
                        {exceedsAvailable && availableQuantity !== null && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ الكمية أكبر من المتاح ({availableQuantity} متاح)
                          </p>
                        )}
                      </div>

                      <div className="flex-[0.2] flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.selectedColor,
                              item.selectedSizeId
                            )
                          }
                          disabled={isMaxQuantity}
                          className={`p-1 rounded ${isMaxQuantity
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'}`}
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.selectedColor,
                              item.selectedSizeId
                            )
                          }
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
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.selectedColor,
                              item.selectedSizeId
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                          title="Remove item"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-center mt-4 mb-4">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mt-2"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* منطقة الإجمالي والأزرار السفلية - ثابتة */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-gray-200 mt-2 flex-shrink-0">
            <div className="flex flex-col md:flex-row gap-2 items-center md:items-start">
              <button
                onClick={handleCheckout}
                className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors text-sm md:text-base"
              >
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
        )}
      </div>
    </div>
  );
};

export default CartDrawer;


