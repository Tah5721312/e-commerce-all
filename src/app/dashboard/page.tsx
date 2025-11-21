'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiBarChart2, FiPackage, FiDollarSign, FiStar } from 'react-icons/fi';
import type { Product } from '@/types/product';
import ProductModal from '@/components/dashboard/ProductModal';
import ProductList from '@/components/dashboard/ProductList';
import StatsCards from '@/components/dashboard/StatsCards';
import ProductImagesModal from '@/components/dashboard/ProductImagesModal';

interface Stats {
  totalProducts: number;
  menProducts: number;
  womenProducts: number;
  averagePrice: number;
  totalValue: number;
  averageRating: number;
  productsWithImages: number;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {stats && <StatsCards stats={stats} />}

        <div className="mt-8">
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onManageImages={handleManageImages}
          />
        </div>

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
      </div>
    </div>
  );
}

