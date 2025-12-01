import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

type HeroSlide = {
  id: number;
  tagLine: string;
  title: string;
  highlight: string;
  saleText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  accentColor: string;
  sortOrder: number;
};

const initialFormState = {
  tagLine: '',
  title: '',
  highlight: '',
  saleText: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  imageUrl: '',
  accentColor: '#D23F57',
  sortOrder: 0,
};

export default function HeroContentTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hero', { cache: 'no-store' });
      if (!response.ok) {
        console.error('Failed to fetch hero slides, status:', response.status);
        setSlides([]);
        return;
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse hero slides JSON', parseError);
        setSlides([]);
        return;
      }

      setSlides(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch hero slides', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder),
      };
      const response = await fetch(
        editingId ? `/api/hero/${editingId}` : '/api/hero',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'تعذر حفظ بيانات الهيرو');
      }

      await fetchSlides();
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'تعذر حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setFormData({
      tagLine: slide.tagLine,
      title: slide.title,
      highlight: slide.highlight,
      saleText: slide.saleText,
      description: slide.description,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      imageUrl: slide.imageUrl,
      accentColor: slide.accentColor,
      sortOrder: slide.sortOrder,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('مسح هذا السلايد؟')) return;
    try {
      const response = await fetch(`/api/hero/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('تعذر حذف السلايد');
      await fetchSlides();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'تعذر حذف السلايد');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Hero Slider</h2>
            <p className="text-sm text-gray-500">
              تحكم بالصور والنصوص التي تظهر في البانر الرئيسي
            </p>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + إنشاء سلايد جديد
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Tagline (سطر صغير فوق العنوان)
            </label>
            <input
              type="text"
              placeholder="مثال: LIFESTYLE COLLECTION"
              className="input input-bordered"
              value={formData.tagLine}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              العنوان الرئيسي (Title)
            </label>
            <input
              type="text"
              placeholder="مثال: MEN أو WOMEN"
              className="input input-bordered"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              كلمة مميزة (Highlight)
            </label>
            <input
              type="text"
              placeholder="مثال: SALE UP TO أو NEW IN"
              className="input input-bordered"
              value={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              النص الملون / النسبة (Sale Text)
            </label>
            <input
              type="text"
              placeholder="مثال: 30% OFF"
              className="input input-bordered"
              value={formData.saleText}
              onChange={(e) => setFormData({ ...formData, saleText: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600">
              الوصف المختصر (Description)
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="الوصف الذي يظهر تحت العنوان"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">نص الزر (Button Text)</label>
            <input
              type="text"
              placeholder="مثال: shop now أو اكتشف الآن"
              className="input input-bordered"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              رابط الزر (Button URL)
            </label>
            <input
              type="url"
              placeholder="مثال: /shop أو /products"
              className="input input-bordered"
              value={formData.buttonLink}
              onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600">
              رابط الصورة (Image URL)
            </label>
            <input
              type="url"
              placeholder="مثال: /images/banner-15.jpg"
              className="input input-bordered"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
            <p className="text-[11px] text-gray-400">
              استخدم مسار من مجلد الصور في المشروع أو رابط صورة خارجي.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                لون مميز للنص (Accent Color)
              </label>
              <span className="text-[11px] text-gray-400">
                يستخدم لتلوين نص الخصم (مثال: 30% OFF)
              </span>
            </div>
            <input
              type="color"
              className="h-10 w-16 rounded border border-gray-200 bg-white"
              value={formData.accentColor}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              ترتيب العرض (Sort Order)
            </label>
            <input
              type="number"
              placeholder="١ للسلايد الأول، ٢ للسلايد الثاني، وهكذا"
              className="input input-bordered"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
            {editingId ? 'تحديث السلايد' : 'إضافة سلايد'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">قائمة السلايدات</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : slides.length === 0 ? (
          <p className="text-center text-gray-500 py-10">لا يوجد سلايدات بعد</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="relative h-48">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p className="text-xs text-gray-400">{slide.tagLine}</p>
                  <h4 className="text-lg font-semibold">{slide.title}</h4>
                  <p className="text-gray-500">{slide.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-700">
                      {slide.highlight}
                    </span>
                    <span style={{ color: slide.accentColor }}>{slide.saleText}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t mt-3">
                    <span className="text-xs text-gray-400">
                      ترتيب: {slide.sortOrder}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 rounded-full border border-gray-200 hover:border-primary-500 transition"
                        aria-label="تعديل"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
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

