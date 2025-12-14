import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus,FiTrash2 } from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

type HeroBanner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  textColor: string;
  sortOrder: number;
};

const initialBannerFormState = {
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  imageUrl: '',
  textColor: '#2B3445',
  sortOrder: 0,
};

export default function HeroBannersTab() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [bannerFormData, setBannerFormData] = useState(initialBannerFormState);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DOMAIN}/api/hero-banners`, { cache: 'no-store' });
      if (!response.ok) {
        console.error('Failed to fetch hero banners, status:', response.status);
        setBanners([]);
        return;
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse hero banners JSON', parseError);
        setBanners([]);
        return;
      }

      setBanners(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch hero banners', error);
    } finally {
      setLoading(false);
    }
  };

  const resetBannerForm = () => {
    setBannerFormData(initialBannerFormState);
    setEditingBannerId(null);
  };

  const handleBannerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...bannerFormData,
        sortOrder: Number(bannerFormData.sortOrder),
      };
      const response = await fetch(
        editingBannerId ? `${DOMAIN}/api/hero-banners/${editingBannerId}` : `${DOMAIN}/api/hero-banners`,
        {
          method: editingBannerId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'تعذر حفظ بيانات البانر الجانبي');
      }

      await fetchBanners();
      resetBannerForm();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'تعذر حفظ بيانات البانر');
    } finally {
      setSaving(false);
    }
  };

  const handleBannerEdit = (banner: HeroBanner) => {
    setEditingBannerId(banner.id);
    setBannerFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      imageUrl: banner.imageUrl,
      textColor: banner.textColor,
      sortOrder: banner.sortOrder,
    });
  };

  const handleBannerDelete = async (id: number) => {
    if (!confirm('مسح هذا البانر؟')) return;
    try {
      const response = await fetch(`${DOMAIN}/api/hero-banners/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('تعذر حذف البانر');
      await fetchBanners();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'تعذر حذف البانر');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Hero Side Banners</h2>
            <p className="text-sm text-gray-500">
              تحكم في الكارتين الجانبيين بجوار السلايدر (NEW ARRIVALS / GAMING)
            </p>
          </div>
          {editingBannerId && (
            <button
              onClick={resetBannerForm}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + إنشاء بانر جديد
            </button>
          )}
        </div>

        <form
          onSubmit={handleBannerSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              العنوان الرئيسي (Title)
            </label>
            <input
              type="text"
              placeholder="مثال: NEW ARRIVALS أو GAMING 4K"
              className="input input-bordered"
              value={bannerFormData.title}
              onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              سطر فرعي (Subtitle)
            </label>
            <input
              type="text"
              placeholder="مثال: SUMMER أو DESKTOPS & LAPTOPS"
              className="input input-bordered"
              value={bannerFormData.subtitle}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, subtitle: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600">
              الوصف (Description)
            </label>
            <input
              type="text"
              placeholder="مثال: SALE 20% OFF"
              className="input input-bordered"
              value={bannerFormData.description}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">نص الزر (Button Text)</label>
            <input
              type="text"
              placeholder="مثال: shop now"
              className="input input-bordered"
              value={bannerFormData.buttonText}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, buttonText: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              رابط الزر (Button URL)
            </label>
            <input
              type="url"
              placeholder="مثال: /shop"
              className="input input-bordered"
              value={bannerFormData.buttonLink}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, buttonLink: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600">
              رابط الصورة (Image URL)
            </label>
            <input
              type="url"
              placeholder="مثال: /images/banner-17.jpg"
              className="input input-bordered"
              value={bannerFormData.imageUrl}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                لون النص (Text Color)
              </label>
              <span className="text-[11px] text-gray-400">
                يتحكم في لون النص داخل البانر (أبيض للصورة الداكنة، غامق للصورة الفاتحة)
              </span>
            </div>
            <input
              type="color"
              className="h-10 w-16 rounded border border-gray-200 bg-white"
              value={bannerFormData.textColor}
              onChange={(e) =>
                setBannerFormData({ ...bannerFormData, textColor: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              ترتيب العرض (Sort Order)
            </label>
            <input
              type="number"
              placeholder="١ للبانر الأول، ٢ للبانر الثاني"
              className="input input-bordered"
              value={bannerFormData.sortOrder}
              onChange={(e) =>
                setBannerFormData({
                  ...bannerFormData,
                  sortOrder: Number(e.target.value),
                })
              }
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition disabled:opacity-60"
          >
            <FiPlus />
            {editingBannerId ? 'تحديث البانر' : 'إضافة بانر'}
          </button>
        </form>

        <h3 className="text-lg font-semibold text-gray-800 mb-4">قائمة البانرات الجانبية</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <p className="text-center text-gray-500 py-6">لا يوجد بانرات بعد</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="relative h-40">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <h4 className="text-lg font-semibold">{banner.title}</h4>
                  {banner.subtitle && (
                    <p className="text-gray-700 whitespace-pre-line">{banner.subtitle}</p>
                  )}
                  {banner.description && (
                    <p className="text-gray-500">{banner.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t mt-3">
                    <span className="text-xs text-gray-400">
                      ترتيب: {banner.sortOrder}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBannerEdit(banner)}
                        className="p-2 rounded-full border border-gray-200 hover:border-primary-500 transition"
                        aria-label="تعديل"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleBannerDelete(banner.id)}
                        className="p-2 rounded-full border border-gray-200 hover:border-red-500 text-red-500 transition"
                        aria-label="حذف"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


