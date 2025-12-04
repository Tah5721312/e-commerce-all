'use client';

import { FiEdit, FiTrash2, FiEye, FiImage } from 'react-icons/fi';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onManageImages: (product: Product) => void;
}

const ProductList = ({ products, onEdit, onDelete, onManageImages }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              // Handle both local and external image URLs
              const getImageUrl = (url: string | undefined) => {
                if (!url) return '/images/default-image.png';
                // If it's already a full URL (http/https), use it as is
                if (url.startsWith('http://') || url.startsWith('https://')) {
                  return url;
                }
                // If it starts with /, it's a local path
                if (url.startsWith('/')) {
                  return url;
                }
                // Otherwise, prepend /
                return `/${url}`;
              };

              const imageUrl = getImageUrl(
                product.productimg && product.productimg[0]?.url
                  ? product.productimg[0].url
                  : undefined
              );

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.productTitle}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.productDiscription.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.productPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">
                        {product.productRating.toFixed(1)}
                      </span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(product.productRating)
                              ? 'fill-current'
                              : 'text-gray-300'
                              }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {product.reviews && product.reviews.length > 0 && (
                        <span className="text-xs text-gray-500">
                          ({product.reviews.length})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onManageImages(product)}
                        className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded"
                        title="Manage Images"
                      >
                        <FiImage className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

