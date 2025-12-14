'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { DOMAIN } from '@/lib/constants';

import ProductDetails from '@/components/main/ProductDetails';

import type { Product, ProductReview } from '@/types/product';

interface ReviewsResponse {
  data: ProductReview[];
}

const ProductReviewsPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState('ضيف');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        fetch(`${DOMAIN}/api/products/${productId}`),
        fetch(`${DOMAIN}/api/products/${productId}/reviews`),
      ]);

      if (!productRes.ok) {
        if (productRes.status === 404) {
          throw new Error('المنتج غير موجود / Product not found');
        }
        throw new Error(
          'تعذر تحميل بيانات المنتج. يرجى المحاولة مرة أخرى / Unable to load product details. Please try again.'
        );
      }
      const productData = await productRes.json();
      setProduct(productData.data as Product);

      if (reviewsRes.ok) {
        const reviewsData = (await reviewsRes.json()) as ReviewsResponse;
        setReviews(reviewsData.data || []);
      } else {
        setReviews([]);
      }
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes('fetch')) {
        setError(
          'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت / Unable to connect to server. Please check your internet connection.'
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى / An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !comment.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${DOMAIN}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author || 'ضيف', rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل في إضافة التعليق');
      }

      setReviews((prev) => [data.data as ProductReview, ...prev]);
      setComment('');
      setRating(5);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء إضافة التعليق');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!productId) return;
    const confirmDelete = confirm('هل أنت متأكد من حذف هذا التعليق؟');
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${DOMAIN}/api/products/${productId}/reviews?reviewId=${reviewId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل في حذف التعليق');
      }
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء حذف التعليق');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500' />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
          <div className='mb-4'>
            <svg
              className='w-16 h-16 mx-auto text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            حدث خطأ / Error
          </h3>
          <p className='text-sm text-red-600 mb-4'>
            {error || 'المنتج غير موجود / Product not found'}
          </p>
          <div className='flex gap-3 justify-center'>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchData();
              }}
              className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm'
            >
              إعادة المحاولة / Retry
            </button>
            <a
              href='/'
              className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm'
            >
              العودة للرئيسية / Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 py-8'>
        {/* تفاصيل المنتج */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8'>
          <ProductDetails product={product} />
        </div>

        {/* التقييمات والتعليقات */}
        <section className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                التقييمات والتعليقات
              </h2>
              <p className='text-xs text-gray-500'>
                اطلع على آراء العملاء وأضف تقييمك للمنتج
              </p>
            </div>
            <a href='/' className='text-xs text-primary-600 hover:underline'>
              العودة للرئيسية
            </a>
          </div>

          {/* نموذج إضافة تعليق */}
          <form
            onSubmit={handleAddReview}
            className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'
          >
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                اسمك
              </label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder='مثال: أحمد'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                التقييم (من 1 إلى 5)
              </label>
              <input
                type='number'
                min={1}
                max={5}
                step={1}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value) || 5)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
            <div className='md:col-span-3'>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                تعليقك
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='اكتب رأيك بصراحة عن المنتج...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
            <div className='md:col-span-3 flex justify-end'>
              <button
                type='submit'
                disabled={submitting}
                className='px-5 py-2 bg-primary-500 text-white rounded-full text-xs font-medium hover:bg-primary-600 transition-colors disabled:opacity-50'
              >
                {submitting ? 'جارٍ الإرسال...' : 'إضافة التعليق'}
              </button>
            </div>
          </form>

          {/* قائمة التعليقات */}
          {reviews.length === 0 ? (
            <p className='text-xs text-gray-500 text-center py-6'>
              لا توجد تعليقات بعد. كن أول من يقيّم هذا المنتج!
            </p>
          ) : (
            <ul className='space-y-3'>
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className='border border-gray-200 rounded-lg p-3 flex flex-col gap-1'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-semibold text-gray-800'>
                        {review.author}
                      </span>
                      <span className='text-[11px] text-gray-400'>
                        {new Date(review.createdAt).toLocaleDateString(
                          'ar-EG',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < review.rating ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className='text-xs text-gray-700 leading-relaxed'>
                    {review.comment}
                  </p>
                  <div className='flex justify-end'>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className='text-[11px] text-red-500 hover:text-red-600'
                    >
                      حذف التعليق
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductReviewsPage;
