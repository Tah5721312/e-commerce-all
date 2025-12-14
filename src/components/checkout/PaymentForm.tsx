'use client';

import { useState, FormEvent } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { FiLock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { DOMAIN } from '@/lib/constants';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface PaymentFormProps {
  total: number;
}

function CheckoutForm({ total }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch(`${DOMAIN}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents
          currency: 'usd',
          customerInfo,
        }),
      });

      const { clientSecret, error: apiError } = await response.json();

      if (apiError) {
        setError(apiError);
        setLoading(false);
        return;
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                postal_code: customerInfo.postalCode,
                country: customerInfo.country,
              },
            },
          },
        });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order in database
        try {
          const orderResponse = await fetch(`${DOMAIN}/api/orders/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({
                customerInfo,
                items: cartItems.map((item) => ({
                  productId: item.id,
                  productTitle: item.productTitle,
                  productPrice: item.productPrice,
                  quantity: item.quantity,
                  colorId: item.selectedColor,
                  sizeId: item.selectedSizeId,
                })),
                totalAmount: total,
                stripePaymentIntentId: paymentIntent.id,
              }),
          });

          const orderData = await orderResponse.json();

          if (orderData.success && orderData.order) {
            setOrderNumber(orderData.order.orderNumber);

            // Send confirmation email
            try {
              await fetch(`${DOMAIN}/api/orders/send-confirmation`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderNumber: orderData.order.orderNumber,
                  customerEmail: customerInfo.email,
                  customerName: customerInfo.name,
                  totalAmount: total,
                }),
              });
            } catch (emailError) {
              console.error('Failed to send email:', emailError);
              // Don't fail the order if email fails
            }

            setSuccess(true);
            clearCart();
            setTimeout(() => {
              router.push(`/thank-you?order=${orderData.order.orderNumber}`);
            }, 2000);
          } else {
            throw new Error('Failed to create order');
          }
        } catch (orderError) {
          console.error('Error creating order:', orderError);
          setError('Payment succeeded but failed to save order. Please contact support.');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            required
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="123 Main St"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={customerInfo.city}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, city: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={customerInfo.postalCode}
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  postalCode: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="10001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              required
              value={customerInfo.country}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, country: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="US">United States</option>
              <option value="EG">Egypt</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiCreditCard className="w-5 h-5" />
          Card Details
        </h3>
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <FiLock className="w-5 h-5" />
            Pay ${total.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
        <FiLock className="w-3 h-3" />
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}

export default function PaymentForm({ total }: PaymentFormProps) {
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(total * 100),
    currency: 'usd',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm total={total} />
    </Elements>
  );
}

