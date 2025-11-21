'use client';

import { useState } from 'react';
import { FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

const Header1 = () => {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <div className="bg-[#2B3445] py-1 rounded-b-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="mr-2 px-2.5 py-1 bg-[#D23F57] rounded-xl text-xs font-bold text-white">
            HOT
          </span>

          <span className="text-xs font-light text-white hidden sm:block">
            Free Express Shipping
          </span>

          <div className="flex-grow" />

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-white text-xs px-1 hover:cursor-pointer"
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
                <div className="absolute right-0 mt-1 bg-white rounded shadow-lg z-10 min-w-[60px]">
                  {['AR', 'EN'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${
                        selectedLang === lang ? 'bg-gray-50' : ''
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <FiTwitter className="w-4 h-4 text-white" />
            <FiFacebook className="w-4 h-4 text-white mx-1" />
            <FiInstagram className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header1;

