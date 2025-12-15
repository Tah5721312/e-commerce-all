'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiEdit, FiEye, FiFilter, FiSearch, FiTrash2 } from 'react-icons/fi';

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
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderNumber: string, status: string) => void;
  onDelete: (orderNumber: string) => void;
  onView: (orderNumber: string) => void;
}

const OrderList = ({
  orders,
  onUpdateStatus,
  onDelete,
  onView,
}: OrderListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='bg-white rounded-lg shadow-md'>
      {/* Filters */}
      <div className='p-4 border-b flex flex-col md:flex-row gap-4'>
        <div className='flex-1 relative'>
          <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='بحث بالرقم، الاسم، أو البريد...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          />
        </div>
        <div className='flex items-center gap-2'>
          <FiFilter className='text-gray-400' />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          >
            <option value='all'>جميع الحالات</option>
            <option value='pending'>قيد الانتظار</option>
            <option value='processing'>قيد المعالجة</option>
            <option value='shipped'>تم الشحن</option>
            <option value='delivered'>تم التسليم</option>
            <option value='cancelled'>ملغي</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                رقم الطلب
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                العميل
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                المبلغ
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                الحالة
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                التاريخ
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
                  لا توجد طلبات
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className='text-purple-600 hover:text-purple-800 font-medium'
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {order.customerName}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-semibold text-gray-900'>
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {order.items.length} منتج
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => onView(order.orderNumber)}
                        className='text-blue-600 hover:text-blue-800'
                        title='عرض التفاصيل'
                      >
                        <FiEye className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() =>
                          onUpdateStatus(order.orderNumber, order.status)
                        }
                        className='text-green-600 hover:text-green-800'
                        title='تحديث الحالة'
                      >
                        <FiEdit className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                            onDelete(order.orderNumber);
                          }
                        }}
                        className='text-red-600 hover:text-red-800'
                        title='حذف'
                      >
                        <FiTrash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
