'use client';

import { FiBarChart2,FiDollarSign, FiPackage, FiStar } from 'react-icons/fi';

interface Stats {
  totalProducts: number;
  menProducts: number;
  womenProducts: number;
  averagePrice: number;
  totalValue: number;
  averageRating: number;
  productsWithImages: number;
}

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Men Products',
      value: stats.menProducts,
      icon: FiBarChart2,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Women Products',
      value: stats.womenProducts,
      icon: FiBarChart2,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Average Price',
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: FiStar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
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

export default StatsCards;

