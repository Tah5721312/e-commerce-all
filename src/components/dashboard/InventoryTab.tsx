'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiMinus, FiEdit2, FiSearch } from 'react-icons/fi';
import type { Product } from '@/types/product';
import { DOMAIN } from '@/lib/constants';

interface InventoryItem {
  id: number;
  productId: number;
  productTitle: string;
  colorId?: number;
  colorName?: string;
  sizeId?: number;
  sizeName?: string;
  currentQuantity: number;
  type: 'variant' | 'color'; // variant = has size, color = no size
}

const InventoryTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('set');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      buildInventory();
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildInventory = () => {
    const inventoryItems: InventoryItem[] = [];

    products.forEach((product) => {
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color) => {
          if (color.variants && color.variants.length > 0) {
            // Product has sizes - use variants
            color.variants.forEach((variant) => {
              inventoryItems.push({
                id: variant.id,
                productId: product.id,
                productTitle: product.productTitle,
                colorId: color.id,
                colorName: color.colorName,
                sizeId: variant.size?.id,
                sizeName: variant.size?.displayName,
                currentQuantity: variant.quantity,
                type: 'variant',
              });
            });
          } else {
            // Product has colors but no sizes - use color quantity
            inventoryItems.push({
              id: color.id,
              productId: product.id,
              productTitle: product.productTitle,
              colorId: color.id,
              colorName: color.colorName,
              currentQuantity: (color as any).quantity || 0,
              type: 'color',
            });
          }
        });
      }
    });

    setInventory(inventoryItems);
  };

  const handleUpdateQuantity = async (item: InventoryItem) => {
    try {
      let newQuantity = item.currentQuantity;

      if (operation === 'add') {
        newQuantity = item.currentQuantity + quantityChange;
      } else if (operation === 'subtract') {
        newQuantity = Math.max(0, item.currentQuantity - quantityChange);
      } else {
        newQuantity = quantityChange;
      }

      const url =
        item.type === 'variant'
          ? `${DOMAIN}/api/products/variants/${item.id}/quantity`
          : `${DOMAIN}/api/products/colors/${item.id}/quantity`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
          operation: 'set',
        }),
      });

      if (response.ok) {
        // Update local state
        setInventory((prev) =>
          prev.map((i) =>
            i.id === item.id && i.type === item.type
              ? { ...i, currentQuantity: newQuantity }
              : i
          )
        );
        setEditingItem(null);
        setQuantityChange(0);
        alert('تم تحديث الكمية بنجاح!');
      } else {
        const error = await response.json();
        alert(error.error || 'فشل تحديث الكمية');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('حدث خطأ أثناء تحديث الكمية');
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.colorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sizeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = inventory.reduce((sum, item) => sum + item.currentQuantity, 0);
  const lowStockItems = inventory.filter((item) => item.currentQuantity < 10).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">إجمالي القطع</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
              <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">منتجات منخفضة المخزون</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
              <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">إجمالي المنتجات</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="ابحث عن منتج، لون، أو مقاس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اللون
                </th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المقاس
                </th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكمية الحالية
                </th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.productTitle}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {item.colorName && (
                        <>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                            style={{
                              backgroundColor: (products
                                .find((p) => p.id === item.productId)
                                ?.colors?.find((c) => c.id === item.colorId) as any)
                                ?.colorCode || '#000',
                            }}
                          />
                          <span className="text-sm text-gray-700">{item.colorName}</span>
                        </>
                      )}
                      {!item.colorName && <span className="text-sm text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {item.sizeName || '-'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <span
                      className={`text-sm font-medium ${item.currentQuantity < 10
                        ? 'text-red-600'
                        : item.currentQuantity < 50
                          ? 'text-yellow-600'
                          : 'text-green-600'
                        }`}
                    >
                      {item.currentQuantity}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm font-medium">
                    {editingItem?.id === item.id && editingItem?.type === item.type ? (
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        <select
                          value={operation}
                          onChange={(e) =>
                            setOperation(e.target.value as 'set' | 'add' | 'subtract')
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="set">تعيين</option>
                          <option value="add">إضافة</option>
                          <option value="subtract">خصم</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={quantityChange}
                          onChange={(e) => setQuantityChange(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="الكمية"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item)}
                          className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm whitespace-nowrap"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(null);
                            setQuantityChange(0);
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm whitespace-nowrap"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setQuantityChange(item.currentQuantity);
                          setOperation('set');
                        }}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1 justify-end"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>تعديل</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد منتجات في المخزون</p>
          </div>
        )}
      </div>

      {/* Inventory Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        {filteredInventory.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
          >
            <div className="space-y-3">
              {/* Product Title */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.productTitle}</h3>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">اللون</p>
                  <div className="flex items-center gap-2">
                    {item.colorName && (
                      <>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          style={{
                            backgroundColor: (products
                              .find((p) => p.id === item.productId)
                              ?.colors?.find((c) => c.id === item.colorId) as any)
                              ?.colorCode || '#000',
                          }}
                        />
                        <span className="text-gray-700">{item.colorName}</span>
                      </>
                    )}
                    {!item.colorName && <span className="text-gray-400">-</span>}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">المقاس</p>
                  <span className="text-gray-700">{item.sizeName || '-'}</span>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">الكمية الحالية</p>
                  <span
                    className={`text-base font-semibold ${item.currentQuantity < 10
                      ? 'text-red-600'
                      : item.currentQuantity < 50
                        ? 'text-yellow-600'
                        : 'text-green-600'
                      }`}
                  >
                    {item.currentQuantity}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-200">
                {editingItem?.id === item.id && editingItem?.type === item.type ? (
                  <div className="space-y-3">
                    <select
                      value={operation}
                      onChange={(e) =>
                        setOperation(e.target.value as 'set' | 'add' | 'subtract')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="set">تعيين</option>
                      <option value="add">إضافة</option>
                      <option value="subtract">خصم</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={quantityChange}
                      onChange={(e) => setQuantityChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="الكمية"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item)}
                        className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setQuantityChange(0);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setQuantityChange(item.currentQuantity);
                      setOperation('set');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    تعديل الكمية
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredInventory.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد منتجات في المخزون</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTab;

