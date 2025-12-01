'use client';

import { MouseEvent, useState } from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  const [openModal, setOpenModal] = useState<null | 'privacy' | 'terms'>(null);

  const closeModal = () => setOpenModal(null);

  const handleModalOpen =
    (type: 'privacy' | 'terms') => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenModal(type);
    };

  return (
    <footer
      className="bg-[#111827] text-gray-300 mt-10 border-t border-gray-800"
      dir="rtl"
    >
      {/* Top section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-right">
        {/* Brand / About */}
        <div className="sm:col-span-2">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            Shop<span className="text-[#ff7790]">X</span>
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            تجربة تسوّق حديثة وسهلة مع أفضل العروض والمنتجات المختارة بعناية.
          </p>
        </div>


        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            الدعم
          </h3>
          <ul className="mt-4 space-y-2 text-sm">

            <li>
              <button
                type="button"
                onClick={handleModalOpen('privacy')}
                className="hover:text-[#ff7790] transition-colors duration-150 cursor-pointer bg-transparent p-0 border-none outline-none text-right w-full"
              >
                سياسة الخصوصية
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleModalOpen('terms')}
                className="hover:text-[#ff7790] transition-colors duration-150 cursor-pointer bg-transparent p-0 border-none outline-none text-right w-full"
              >
                الشروط والأحكام
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            تواصل معنا
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <span className="text-gray-400">Email:</span>{' '}
              <a
                href="mailto:tah57@gmail.com"
                className="hover:text-[#ff7790] transition-colors duration-150"
              >
                tah57@gmail.com
              </a>
            </li>
            <li>
              <span className="text-gray-400">Phone:</span>{' '}
              <a
                href="tel:+201234567890"
                className="hover:text-[#ff7790] transition-colors duration-150 "
              >
                +20 123 456 7890
              </a>
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-3">
            {/* Social icons (simple SVGs) */}
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#ff7790] hover:text-[#ff7790] transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#ff7790] hover:text-[#ff7790] transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M13 3h4a1 1 0 110 2h-3v3h2.5a1 1 0 01.98 1.197l-.5 2.5A1 1 0 0115 12h-1v8a1 1 0 01-1 1H9a1 1 0 01-1-1v-8H6a1 1 0 01-1-1V9a1 1 0 011-1h2V6a3 3 0 013-3h2z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="X"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#ff7790] hover:text-[#ff7790] transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M4 4h3l4 5.5L15.5 4H20l-6.5 8.3L20 20h-3l-4.5-5.9L8 20H4l6.6-8.4L4 4z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            © {year} جميع الحقوق محفوظة لـ{' '}
            <span className="mx-1 text-[#ff7790] font-medium">
              Mohamed Abdelftah
            </span>
          </p>

          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
            Designed &amp; developed with Mohamed Abdelftah using Next.js
          </p>
        </div>
      </div>

      {/* Legal modals */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#020617] border border-gray-800 max-w-2xl w-full mx-4 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-800">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {openModal === 'privacy' ? 'سياسة الخصوصية' : 'الشروط والأحكام'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors duration-150 text-xl leading-none"
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto text-sm leading-relaxed text-gray-300 space-y-3">
              {openModal === 'privacy' ? (
                <>
                  <p>
                    نحترم خصوصيتك بشكل كامل، ويتم استخدام بياناتك فقط لتحسين تجربة
                    التسوّق، إتمام الطلبات، والتواصل معك بشأن العروض والتحديثات.
                  </p>
                  <p>
                    لا نقوم بمشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية
                    بدون موافقتك المسبقة، ويتم تخزين البيانات في بيئة آمنة قدر
                    الإمكان.
                  </p>
                  <p>
                    يمكنك في أي وقت طلب تحديث أو حذف بعض بياناتك من خلال التواصل
                    معنا عبر وسائل التواصل المتاحة في الموقع.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    باستخدامك لهذا الموقع، فإنك توافق على جميع الشروط والأحكام
                    الخاصة بعملية التصفح، إنشاء حساب، وإتمام عمليات الشراء.
                  </p>
                  <p>
                    الأسعار، العروض، وسياسات الشحن والإرجاع قد تتغير من وقت لآخر،
                    ويقع على عاتقك مراجعة الصفحة بشكل دوري لمعرفة أي تحديثات.
                  </p>
                  <p>
                    في حال وجود أي استفسار أو اعتراض على أحد الشروط، يمكنك
                    التواصل معنا قبل إتمام عملية الشراء للحصول على توضيحات أكثر.
                  </p>
                </>
              )}
            </div>

            <div className="px-4 sm:px-6 py-3 border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-1.5 text-sm rounded-md bg-[#ff7790] text-white hover:bg-[#ff5676] transition-colors duration-150"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
