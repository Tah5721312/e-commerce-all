'use client';

import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiBarChart2,
  FiPackage,
  FiDollarSign,
  FiStar,
  FiShoppingBag,
} from 'react-icons/fi';
import type { Product } from '@/types/product';
import ProductModal from '@/components/dashboard/ProductModal';
import ProductList from '@/components/dashboard/ProductList';
import StatsCards from '@/components/dashboard/StatsCards';
import ProductImagesModal from '@/components/dashboard/ProductImagesModal';
import OrderList from '@/components/dashboard/OrderList';
import OrderModal from '@/components/dashboard/OrderModal';
import OrderStatsCards from '@/components/dashboard/OrderStatsCards';
import HeroContentTab from '@/components/dashboard/HeroContentTab';
import HeroBannersTab from '@/components/dashboard/HeroBannersTab';
import CategoriesTab from '@/components/dashboard/CategoriesTab';

interface Stats {
  totalProducts: number;
  menProducts: number;
  womenProducts: number;
  averagePrice: number;
  totalValue: number;
  averageRating: number;
  productsWithImages: number;
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
  items: any[];
}

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'hero' | 'heroBanners' | 'categories'
  >('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ orderNumber: string; status: string } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchStats();
    if (activeTab === 'orders') {
      fetchOrders();
      fetchOrderStats();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await fetch('/api/orders/stats');
      const data = await response.json();
      setOrderStats(data.data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderNumber: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
        fetchOrderStats();
      } else {
        alert('فشل تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('خطأ في تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchOrders();
        fetchOrderStats();
      } else {
        alert('فشل حذف الطلب');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('خطأ في حذف الطلب');
    }
  };

  const handleViewOrder = (orderNumber: string) => {
    window.open(`/orders/${orderNumber}`, '_blank');
  };

  const handleOpenOrderModal = (orderNumber: string, status: string) => {
    setSelectedOrder({ orderNumber, status });
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        fetchStats();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
    fetchStats();
  };

  const handleManageImages = (product: Product) => {
    setSelectedProduct(product);
    setIsImagesModalOpen(true);
  };

  const handleImagesModalClose = () => {
    setIsImagesModalOpen(false);
    setSelectedProduct(null);
    fetchProducts();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم / Dashboard</h1>
          {activeTab === 'products' && (
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b flex-wrap">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'products'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiPackage className="inline-block w-5 h-5 mr-2" />
            المنتجات / Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'orders'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiShoppingBag className="inline-block w-5 h-5 mr-2" />
            الطلبات / Orders
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'hero'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiBarChart2 className="inline-block w-5 h-5 mr-2" />
            Hero Slider
          </button>
          <button
            onClick={() => setActiveTab('heroBanners')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'heroBanners'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiBarChart2 className="inline-block w-5 h-5 mr-2" />
            Hero Side Banners
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'categories'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiBarChart2 className="inline-block w-5 h-5 mr-2" />
            Categories
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {stats && <StatsCards stats={stats} />}
            <div className="mt-8">
              <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onManageImages={handleManageImages}
              />
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {orderStats && <OrderStatsCards stats={orderStats} />}
            <div className="mt-8">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <OrderList
                  orders={orders}
                  onUpdateStatus={handleOpenOrderModal}
                  onDelete={handleDeleteOrder}
                  onView={handleViewOrder}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'hero' && (
          <div className="mt-8">
            <HeroContentTab />
          </div>
        )}

        {activeTab === 'heroBanners' && (
          <div className="mt-8">
            <HeroBannersTab />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="mt-8">
            <CategoriesTab onCategoryChange={() => {
              fetchProducts();
              fetchStats();
            }} />
          </div>
        )}

        {/* Modals */}
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            onClose={handleModalClose}
          />
        )}

        {isImagesModalOpen && selectedProduct && (
          <ProductImagesModal
            product={selectedProduct}
            onClose={handleImagesModalClose}
            onUpdate={fetchProducts}
          />
        )}

        {isOrderModalOpen && selectedOrder && (
          <OrderModal
            orderNumber={selectedOrder.orderNumber}
            currentStatus={selectedOrder.status}
            onClose={handleCloseOrderModal}
            onUpdate={handleUpdateOrderStatus}
          />
        )}
      </div>
    </div>
  );
}

