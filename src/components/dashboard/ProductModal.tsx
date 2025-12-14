'use client';

import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { Product, ProductSize, ProductCategory } from '@/types/product';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

interface ColorFormData {
  colorName: string;
  colorCode: string;
  quantity: number; // For products without sizes
  variants: Array<{
    sizeId: number;
    quantity: number;
  }>;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [formData, setFormData] = useState({
    productTitle: '',
    productPrice: '',
    productDiscription: '',
    productRating: '0',
    category: '',
    company: '',
    quantity: '0', // For products without colors or sizes
    images: [] as string[],
  });
  const [colors, setColors] = useState<ColorFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSizes();
    fetchCompanies();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
        if (data.data && data.data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: data.data[0].slug }));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes?sortBy=sortOrder&order=asc');
      if (response.ok) {
        const data = await response.json();
        setSizes(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sizes:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies?activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        productTitle: product.productTitle,
        productPrice: product.productPrice.toString(),
        productDiscription: product.productDiscription,
        productRating: product.productRating.toString(),
        category: typeof product.category === 'string' ? product.category : product.category.slug,
        company: product.companyId?.toString() || '',
        quantity: product.quantity?.toString() || '0',
        images: product.productimg?.map((img) => img.url) || [],
      });
      setColors(
        product.colors?.map((color) => ({
          colorName: color.colorName,
          colorCode: color.colorCode,
          quantity: (color as any).quantity || 0, // For products without variants
          variants: color.variants.map((v) => ({
            sizeId: v.size?.id || v.sizeId || 0,
            quantity: v.quantity,
          })),
        })) || []
      );
    } else {
      setColors([]);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product ? 'PUT' : 'POST';

      // Ensure images is always an array and filter out empty values
      const imagesToSend = Array.isArray(formData.images)
        ? formData.images.filter((url) => url && url.trim() !== '')
        : [];

      // Find category by slug
      const selectedCategory = categories.find(cat => cat.slug === formData.category);
      if (!selectedCategory) {
        alert('Please select a valid category');
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...formData,
        category: selectedCategory.id, // Send category ID
        company: formData.company ? parseInt(formData.company) : null, // Send company ID or null
        quantity: (!colors || colors.length === 0) ? parseInt(formData.quantity) || 0 : 0, // Only set quantity if no colors
        images: imagesToSend,
        colors: colors.map((color) => ({
          colorName: color.colorName,
          colorCode: color.colorCode,
          quantity: color.variants.length === 0 ? color.quantity : 0, // Only set quantity if no variants
          variants: color.variants.map((v) => ({
            sizeId: v.sizeId,
            quantity: v.quantity,
          })),
        })),
      };

      console.log('=== SENDING PRODUCT DATA ===');
      console.log('Form data:', formData);
      console.log('Images from form:', formData.images);
      console.log('Images to send:', imagesToSend);
      console.log('Images count:', imagesToSend.length);
      console.log('Full data to send:', dataToSend);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Product saved successfully:', responseData);
        alert(`Product ${product ? 'updated' : 'created'} successfully!`);
        onClose();
      } else {
        console.error('Error response:', responseData);
        alert(responseData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddColor = () => {
    setColors([
      ...colors,
      {
        colorName: '',
        colorCode: '#000000',
        quantity: 0,
        variants: [],
      },
    ]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleUpdateColor = (index: number, field: 'colorName' | 'colorCode' | 'quantity', value: string | number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const handleAddVariant = (colorIndex: number) => {
    const newColors = [...colors];
    const availableSizes = sizes.filter(
      (size) => !newColors[colorIndex].variants.some((v) => v.sizeId === size.id)
    );
    if (availableSizes.length > 0) {
      newColors[colorIndex].variants.push({
        sizeId: availableSizes[0].id,
        quantity: 0,
      });
      setColors(newColors);
    }
  };

  const handleRemoveVariant = (colorIndex: number, variantIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].variants = newColors[colorIndex].variants.filter(
      (_, i) => i !== variantIndex
    );
    setColors(newColors);
  };

  const handleUpdateVariant = (
    colorIndex: number,
    variantIndex: number,
    field: 'sizeId' | 'quantity',
    value: number
  ) => {
    const newColors = [...colors];
    newColors[colorIndex].variants[variantIndex] = {
      ...newColors[colorIndex].variants[variantIndex],
      [field]: value,
    };
    setColors(newColors);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-50 border-b px-6 py-4 flex justify-between items-center z-10 backdrop-blur-sm bg-opacity-95">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.productTitle}
              onChange={(e) =>
                setFormData({ ...formData, productTitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.productPrice}
                onChange={(e) =>
                  setFormData({ ...formData, productPrice: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.productRating}
                onChange={(e) =>
                  setFormData({ ...formData, productRating: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / الشركة
              </label>
              <select
                value={formData.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No Company / بدون شركة</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.productDiscription}
              onChange={(e) =>
                setFormData({ ...formData, productDiscription: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Quantity for products without colors */}
          {(!colors || colors.length === 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكمية / Quantity (للمنتجات بدون ألوان أو مقاسات)
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL (e.g., /images/1.jpg)"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-100 rounded-lg p-2"
                >
                  <div className="w-20 h-20 relative rounded overflow-hidden">
                    <img
                      src={
                        url.startsWith('http://') || url.startsWith('https://')
                          ? url
                          : url.startsWith('/')
                            ? url
                            : `/${url}`
                      }
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/default-image.png';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors and Variants Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                الألوان والمقاسات / Colors & Sizes
              </label>
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
              >
                <FiPlus className="w-4 h-4" />
                إضافة لون
              </button>
            </div>

            <div className="space-y-4">
              {colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="اسم اللون (مثال: أحمر)"
                      value={color.colorName}
                      onChange={(e) =>
                        handleUpdateColor(colorIndex, 'colorName', e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="color"
                      value={color.colorCode}
                      onChange={(e) =>
                        handleUpdateColor(colorIndex, 'colorCode', e.target.value)
                      }
                      className="w-16 h-10 rounded border border-gray-300"
                    />
                    {color.variants.length === 0 && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 whitespace-nowrap">الكمية:</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={color.quantity}
                          onChange={(e) =>
                            handleUpdateColor(colorIndex, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(colorIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-gray-600">
                        المقاسات والكميات
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddVariant(colorIndex)}
                        className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors flex items-center gap-1"
                      >
                        <FiPlus className="w-3 h-3" />
                        إضافة مقاس
                      </button>
                    </div>

                    {color.variants.map((variant, variantIndex) => {
                      const selectedSize = sizes.find(s => s.id === variant.sizeId);
                      return (
                        <div
                          key={variantIndex}
                          className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">المقاس:</span>
                            <select
                              value={variant.sizeId}
                              onChange={(e) =>
                                handleUpdateVariant(
                                  colorIndex,
                                  variantIndex,
                                  'sizeId',
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              {sizes.map((size) => (
                                <option key={size.id} value={size.id}>
                                  {size.displayName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">الكمية:</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={variant.quantity}
                              onChange={(e) =>
                                handleUpdateVariant(
                                  colorIndex,
                                  variantIndex,
                                  'quantity',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(colorIndex, variantIndex)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}

                    {color.variants.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">
                        لا توجد مقاسات مضافة بعد
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {colors.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                  لا توجد ألوان مضافة. المنتج بدون ألوان ومقاسات محددة.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

