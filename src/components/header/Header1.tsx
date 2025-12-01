'use client';

import { useState } from 'react';
import { FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

const Header1 = () => {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <div className="bg-[#2B3445] py-2 md:py-3 rounded-b-md sticky top-0 z-50 shadow">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="mr-2 px-3 py-1.5 bg-[#D23F57] rounded-2xl text-sm font-bold text-white tracking-wide">
            HOT
          </span>

          <span className="text-sm md:text-base font-light text-white hidden sm:block">
            Free Express Shipping
          </span>

          <div className="flex-grow" />

          <div className="flex items-center gap-3 text-sm">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-white text-sm font-medium px-2 hover:cursor-pointer"
              >
                <span>{selectedLang}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl z-10 min-w-[80px] border border-gray-100">
                  {['AR', 'EN'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedLang === lang ? 'bg-gray-50' : ''
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <FiTwitter className="w-5 h-5 text-white" />
            <FiFacebook className="w-5 h-5 text-white mx-1" />
            <FiInstagram className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header1;

