'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiMail,
  FiMapPin,
  FiPackage,
} from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  customerCountry: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderNumber) return;
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/orders/${orderNumber}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
        setError(null);
      } else {
        if (response.status === 404) {
          setError(
            'الطلب غير موجود. يرجى التحقق من رقم الطلب / Order not found. Please check the order number.'
          );
        } else {
          setError(
            data.error ||
              'تعذر تحميل تفاصيل الطلب. يرجى المحاولة مرة أخرى / Unable to load order details. Please try again.'
          );
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('fetch')) {
        setError(
          'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت / Unable to connect to server. Please check your internet connection.'
        );
      } else {
        setError(
          'تعذر تحميل تفاصيل الطلب. يرجى المحاولة مرة أخرى / Unable to load order details. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار / Pending';
      case 'processing':
        return 'قيد المعالجة / Processing';
      case 'shipped':
        return 'تم الشحن / Shipped';
      case 'delivered':
        return 'تم التسليم / Delivered';
      case 'cancelled':
        return 'ملغي / Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
            <p className='mt-4 text-gray-600'>جاري التحميل... / Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>
              {error || 'الطلب غير موجود / Order Not Found'}
            </h1>
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-purple-600 hover:text-purple-700'
            >
              <FiArrowLeft className='w-5 h-5' />
              العودة للصفحة الرئيسية / Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
          >
            <FiArrowLeft className='w-5 h-5' />
            <span>العودة / Back</span>
          </Link>
          <h1 className='text-3xl font-bold'>تفاصيل الطلب / Order Details</h1>
        </div>

        {/* Order Info Card */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {order.orderNumber}
              </h2>
              <p className='text-gray-600'>
                {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className='mt-4 md:mt-0'>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <FiMail className='w-5 h-5' />
                معلومات العميل / Customer Info
              </h3>
              <div className='space-y-2 text-gray-600'>
                <p>
                  <span className='font-medium'>الاسم / Name:</span>{' '}
                  {order.customerName}
                </p>
                <p>
                  <span className='font-medium'>البريد / Email:</span>{' '}
                  {order.customerEmail}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <FiMapPin className='w-5 h-5' />
                العنوان / Address
              </h3>
              <div className='space-y-2 text-gray-600'>
                <p>{order.customerAddress}</p>
                <p>
                  {order.customerCity}, {order.customerPostalCode}
                </p>
                <p>{order.customerCountry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <FiPackage className='w-6 h-6' />
            المنتجات / Items
          </h3>

          <div className='space-y-4'>
            {order.items.map((item) => (
              <div
                key={item.id}
                className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg'
              >
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-900 mb-1'>
                    {item.productTitle}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    الكمية / Quantity: {item.quantity}
                  </p>
                  <p className='text-sm text-gray-600'>
                    السعر / Price: ${item.productPrice.toFixed(2)}
                  </p>
                </div>
                <div className='text-right md:text-left'>
                  <p className='text-lg font-bold text-purple-600'>
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className='mt-6 pt-6 border-t'>
            <div className='flex justify-between items-center'>
              <span className='text-xl font-semibold text-gray-900'>
                الإجمالي / Total:
              </span>
              <span className='text-2xl font-bold text-purple-600 flex items-center gap-2'>
                <FiDollarSign className='w-6 h-6' />
                {order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Date */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex items-center gap-2 text-gray-600'>
            <FiCalendar className='w-5 h-5' />
            <span>
              تاريخ الطلب / Order Date:{' '}
              {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
