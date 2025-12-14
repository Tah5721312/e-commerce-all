'use client';

import { useEffect,useState } from 'react';
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX, FiXCircle } from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

import type { Product } from '@/types/product';

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  imageOrder: number;
  createdAt: string;
}

interface ProductImagesModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

const ProductImagesModal = ({ product, onClose, onUpdate }: ProductImagesModalProps) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingUrl, setEditingUrl] = useState('');

  useEffect(() => {
    fetchImages();
  }, [product.id]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/products/${product.id}/images`);
      const data = await response.json();
      setImages(data.data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    try {
      const response = await fetch(`${DOMAIN}/api/products/${product.id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: newImageUrl.trim(),
        }),
      });

      if (response.ok) {
        setNewImageUrl('');
        fetchImages();
        onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add image');
      }
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Error adding image');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/products/${product.id}/images/${imageId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        fetchImages();
        onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleStartEdit = (image: ProductImage) => {
    setEditingId(image.id);
    setEditingUrl(image.imageUrl);
  };

  const handleSaveEdit = async (imageId: number) => {
    if (!editingUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/products/${product.id}/images/${imageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: editingUrl.trim(),
          }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        setEditingUrl('');
        fetchImages();
        onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUrl('');
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return url;
    }
    return `/${url}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Images - {product.productTitle}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, or delete product images
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Add New Image */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL (e.g., /images/1.jpg or https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleAddImage}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Images List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No images found</p>
              <p className="text-sm mt-2">Add your first image above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-primary-500 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-white">
                    <img
                      src={getImageUrl(image.imageUrl)}
                      alt={`Product image ${image.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/default-image.png';
                      }}
                    />
                  </div>

                  {/* Edit Mode */}
                  {editingId === image.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingUrl}
                        onChange={(e) => setEditingUrl(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Image URL"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(image.id)}
                          className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiSave className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiXCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Image URL Display */}
                      <div className="text-xs text-gray-600 break-all bg-white p-2 rounded">
                        {image.imageUrl}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(image)}
                          className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Order Badge */}
                  <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                    Order: {image.imageOrder}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImagesModal;

