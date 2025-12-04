'use client';

import { FiX, FiHeart, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useFavoritesStore } from '@/store/favoritesStore';

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FavoritesDrawer = ({ open, onClose }: FavoritesDrawerProps) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full md:w-[650px] bg-white p-4 md:p-6 shadow-xl transition-transform duration-500 translate-x-0 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:text-red-500 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 mt-8 flex-shrink-0">
          <h2 className="text-2xl md:text-3xl flex items-center justify-center gap-2">
            <FiHeart className="w-7 h-7 text-red-500" />
            Favorites
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            المنتجات التي قمت بإضافتها إلى المفضلة
          </p>
        </div>

        <div className="border-b border-gray-300 mb-4 flex-shrink-0" />

        <div className="flex-1 overflow-y-auto pr-1">
          {favorites.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              لا توجد منتجات في المفضلة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {/* زر "عرض الكل" */}
              <div className="flex justify-end mb-1">
                <Link
                  href="/favorites"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-[11px] font-medium text-primary-700 hover:bg-primary-100 hover:border-primary-300 transition-colors"
                >
                  عرض الكل
                </Link>
              </div>

              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {item.productimg && item.productimg[0] && (
                      <Image
                        src={
                          item.productimg[0].url.startsWith('http://') ||
                            item.productimg[0].url.startsWith('https://')
                            ? item.productimg[0].url
                            : item.productimg[0].url.startsWith('/')
                              ? item.productimg[0].url
                              : `/${item.productimg[0].url}`
                        }
                        alt={item.productTitle}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {item.productTitle}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                      {item.productDiscription}
                    </p>
                    <p className="text-sm font-semibold text-primary-500 mt-1">
                      ${item.productPrice}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">

                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="إزالة من المفضلة"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesDrawer;



