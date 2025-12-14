'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import {
  FiBook,
  FiBox,
  FiCamera,
  FiChevronRight,
  FiCoffee,
  FiGift,
  FiGrid,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiMenu,
  FiMonitor,
  FiMusic,
  FiShoppingBag,
  FiSmartphone,
  FiTool,
  FiTruck,
  FiWatch,
  FiWifi,
  FiX,
} from 'react-icons/fi';

import { DOMAIN } from '@/lib/constants';

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

interface MenuSubLink {
  label: string;
  href: string;
}

type MenuItem =
  | { mainLink: string; subLinks: MenuSubLink[]; mainHref?: never }
  | { mainLink: string; subLinks: string[]; mainHref?: never }
  | { mainLink: string; subLinks: never[]; mainHref: string };

const Header3 = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      mainLink: 'Pages',
      subLinks: [
        { label: 'المنتجات', href: '/products' },
        { label: 'المفضلة', href: '/favorites' },
      ],
    },
    { mainLink: 'User Account', subLinks: ['Link 1', 'Link 2', 'Link 3'] },
  ];

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${DOMAIN}/api/categories?activeOnly=true`);
      if (!response.ok) {
        throw new Error('تعذر تحميل الفئات / Unable to load categories');
      }
      const data = await response.json();
      setCategories(data.data || []);
      setError(null);
    } catch (err) {
      // Error fetching categories
      setError(
        'تعذر تحميل الفئات. يرجى المحاولة مرة أخرى / Unable to load categories. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryIcon = (categoryName: string): React.ReactNode => {
    const iconSize = 16;
    const iconMap: Record<string, React.ReactNode> = {
      electronics: <FiMonitor size={iconSize} />,
      books: <FiBook size={iconSize} />,
      clothing: <FiShoppingBag size={iconSize} />,
      shoes: <FiGift size={iconSize} />,
      accessories: <FiWatch size={iconSize} />,
      home: <FiHome size={iconSize} />,
      beauty: <FiHeart size={iconSize} />,
      sports: <FiTruck size={iconSize} />,
      toys: <FiGift size={iconSize} />,
      camera: <FiCamera size={iconSize} />,
      tools: <FiTool size={iconSize} />,
      kitchen: <FiCoffee size={iconSize} />,
      computers: <FiMonitor size={iconSize} />,
      phones: <FiSmartphone size={iconSize} />,
      audio: <FiHeadphones size={iconSize} />,
      gaming: <FiMonitor size={iconSize} />,
      network: <FiWifi size={iconSize} />,
      music: <FiMusic size={iconSize} />,
    };

    // Try to find a matching icon, or use a default one
    const iconKey = Object.keys(iconMap).find((key) =>
      categoryName.includes(key)
    );

    return iconKey ? iconMap[iconKey] : <FiBox size={iconSize} />;
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className='container mx-auto px-4 mt-5 flex items-center justify-between'>
      <div className='relative'>
        <button
          onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
          className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition-colors w-[222px]'
        >
          <FiGrid className='w-5 h-5' />
          <span className='flex-1 text-left capitalize'>Categories</span>
          <FiChevronRight className='w-5 h-5' />
        </button>

        {isCategoryMenuOpen && (
          <div className='absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-20 w-[220px] max-h-[400px] overflow-y-auto'>
            {isLoading ? (
              <div className='p-4 text-center text-gray-500'>
                Loading categories...
              </div>
            ) : error ? (
              <div className='p-4 text-center'>
                <p className='text-xs text-red-600 mb-2'>{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    fetchCategories();
                  }}
                  className='text-xs text-primary-600 hover:underline'
                >
                  إعادة المحاولة / Retry
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className='p-4 text-center text-gray-500 text-sm'>
                لا توجد فئات متاحة / No categories available
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex w-full text-left px-4 py-2 hover:bg-gray-100 items-center gap-3'
                >
                  <span className='text-[#D23F57]'>
                    {getCategoryIcon(category.name.toLowerCase())}
                  </span>
                  <span className='capitalize'>{category.name}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Desktop Menu */}

      <div className='hidden xl:flex items-center gap-8'>
        {menuItems.map((item, index) => (
          <div
            key={item.mainLink}
            className='relative'
            onMouseEnter={() => setHoveredMenuItem(index)}
            onMouseLeave={() => setHoveredMenuItem(null)}
          >
            {item.mainHref ? (
              <Link
                href={item.mainHref}
                className='hover:text-[#D23F57] transition-colors flex items-center gap-1'
              >
                {item.mainLink}
              </Link>
            ) : (
              <>
                <Link
                  href='#'
                  className='hover:text-[#D23F57] transition-colors flex items-center gap-1'
                >
                  {item.mainLink}
                  {item.subLinks.length > 0 && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  )}
                </Link>
                {hoveredMenuItem === index && item.subLinks.length > 0 && (
                  <div className='absolute top-full left-0 pt-2 bg-transparent z-50'>
                    <div className='bg-white rounded-lg shadow-lg min-w-[200px] border border-gray-200'>
                      {item.subLinks.map((link, linkIndex) => {
                        const linkHref =
                          typeof link === 'string' ? '#' : link.href;
                        const linkLabel =
                          typeof link === 'string' ? link : link.label;
                        return (
                          <Link
                            key={linkIndex}
                            href={linkHref}
                            target={
                              typeof link === 'object' && link.href
                                ? '_blank'
                                : undefined
                            }
                            rel={
                              typeof link === 'object' && link.href
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className='block px-4 py-2 hover:bg-gray-50 hover:text-[#D23F57] transition-colors first:rounded-t-lg last:rounded-b-lg text-right'
                          >
                            {linkLabel}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Menu Button */}

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className='xl:hidden p-2 hover:bg-gray-100 rounded'
      >
        <FiMenu className='w-6 h-6' />
      </button>

      {/* Mobile Drawer */}

      {isMobileMenuOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 xl:hidden'>
          <div className='absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto'>
            <div className='p-6 relative pt-16'>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-transform hover:rotate-180'
              >
                <FiX className='w-6 h-6' />
              </button>

              {menuItems.map((item, index) => (
                <div key={item.mainLink} className='border-b'>
                  {item.mainHref ? (
                    <Link
                      href={item.mainHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className='w-full flex items-center justify-between py-4 text-left hover:text-[#D23F57] transition-colors'
                    >
                      <span>{item.mainLink}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleExpanded(index)}
                        className='w-full flex items-center justify-between py-4 text-left'
                      >
                        <span>{item.mainLink}</span>
                        {item.subLinks.length > 0 && (
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedItems.includes(index) ? 'rotate-180' : ''
                            }`}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                              clipRule='evenodd'
                            />
                          </svg>
                        )}
                      </button>
                      {expandedItems.includes(index) &&
                        item.subLinks.length > 0 && (
                          <div className='pb-2'>
                            {item.subLinks.map((link, linkIndex) => {
                              const linkHref =
                                typeof link === 'string' ? '#' : link.href;
                              const linkLabel =
                                typeof link === 'string' ? link : link.label;
                              return (
                                <Link
                                  key={linkIndex}
                                  href={linkHref}
                                  target={
                                    typeof link === 'object' && link.href
                                      ? '_blank'
                                      : undefined
                                  }
                                  rel={
                                    typeof link === 'object' && link.href
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className='block py-2 pl-4 hover:bg-gray-50 hover:text-[#D23F57] transition-colors text-right'
                                >
                                  {linkLabel}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header3;
