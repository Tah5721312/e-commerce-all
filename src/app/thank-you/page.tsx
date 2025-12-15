'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { FiCheckCircle, FiHome, FiMail, FiPackage } from 'react-icons/fi';

function ThankYouPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      // You can fetch order details here if needed
      // For now, we'll just display the order number
    }
  }, [orderNumber]);

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          {/* Success Icon */}
          <div className='mb-6'>
            <div className='mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
              <FiCheckCircle className='w-12 h-12 text-green-600' />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            شكراً لك! Thank You!
          </h1>
          <p className='text-lg text-gray-600 mb-6'>
            تم استلام طلبك بنجاح وسيتم معالجته قريباً
          </p>
          <p className='text-base text-gray-500 mb-8'>
            Your order has been received and will be processed soon
          </p>

          {/* Order Number */}
          {orderNumber && (
            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <p className='text-sm text-gray-600 mb-2'>
                رقم الطلب / Order Number
              </p>
              <p className='text-2xl font-bold text-purple-600'>
                {orderNumber}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className='border-t pt-6 mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              الخطوات التالية / Next Steps
            </h2>
            <div className='space-y-4 text-left'>
              <div className='flex items-start gap-3'>
                <FiMail className='w-5 h-5 text-purple-600 mt-1 flex-shrink-0' />
                <div>
                  <p className='font-medium text-gray-900'>
                    تأكيد البريد الإلكتروني / Email Confirmation
                  </p>
                  <p className='text-sm text-gray-600'>
                    تم إرسال رسالة تأكيد إلى بريدك الإلكتروني
                  </p>
                  <p className='text-sm text-gray-500'>
                    A confirmation email has been sent to your email
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <FiPackage className='w-5 h-5 text-purple-600 mt-1 flex-shrink-0' />
                <div>
                  <p className='font-medium text-gray-900'>
                    معالجة الطلب / Order Processing
                  </p>
                  <p className='text-sm text-gray-600'>
                    سيتم تجهيز طلبك وإرساله خلال 2-3 أيام عمل
                  </p>
                  <p className='text-sm text-gray-500'>
                    Your order will be prepared and shipped within 2-3 business
                    days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/'
              className='inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors'
            >
              <FiHome className='w-5 h-5' />
              العودة للصفحة الرئيسية / Back to Home
            </Link>
            {orderNumber && (
              <Link
                href={`/orders/${orderNumber}`}
                className='inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
              >
                <FiPackage className='w-5 h-5' />
                عرض تفاصيل الطلب / View Order
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          Loading...
        </div>
      }
    >
      <ThankYouPageContent />
    </Suspense>
  );
}
