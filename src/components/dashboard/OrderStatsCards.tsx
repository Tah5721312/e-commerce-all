'use client';

import { FiCheckCircle, FiClock, FiDollarSign, FiPackage, FiTruck, FiXCircle } from 'react-icons/fi';

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

interface OrderStatsCardsProps {
  stats: OrderStats;
}

const OrderStatsCards = ({ stats }: OrderStatsCardsProps) => {
  const statCards = [
    {
      title: 'إجمالي الطلبات / Total Orders',
      value: stats.totalOrders,
      icon: FiPackage,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'قيد الانتظار / Pending',
      value: stats.pendingOrders,
      icon: FiClock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'قيد المعالجة / Processing',
      value: stats.processingOrders,
      icon: FiPackage,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'تم الشحن / Shipped',
      value: stats.shippedOrders,
      icon: FiTruck,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'تم التسليم / Delivered',
      value: stats.deliveredOrders,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'ملغي / Cancelled',
      value: stats.cancelledOrders,
      icon: FiXCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'إجمالي الإيرادات / Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'طلبات اليوم / Today Orders',
      value: stats.todayOrders,
      icon: FiPackage,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'إيرادات اليوم / Today Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4"
          >
            <div className={`${stat.bgColor} p-4 rounded-lg`}>
              <Icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatsCards;

