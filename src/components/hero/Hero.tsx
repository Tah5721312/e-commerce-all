'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import IconSection from './IconSection';

type HeroSlide = {
  id?: number;
  tagLine: string;
  title: string;
  highlight: string;
  saleText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  accentColor: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: 1,
    tagLine: 'LIFESTYLE COLLECTION',
    title: 'MEN',
    highlight: 'SALE UP TO',
    saleText: '30% OFF',
    description: 'Get Free Shipping on orders over $99.00',
    buttonText: 'shop now',
    buttonLink: '/shop',
    imageUrl: '/images/banner-15.jpg',
    accentColor: '#D23F57',
  },
  {
    id: 2,
    tagLine: 'NEVER MISS A DROP',
    title: 'WOMEN',
    highlight: 'NEW IN',
    saleText: '15% OFF',
    description: 'Fresh arrivals selected weekly just for you.',
    buttonText: 'discover now',
    buttonLink: '/shop',
    imageUrl: '/images/banner-25.jpg',
    accentColor: '#ff7790',
  },
];

const Hero = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length) {
          setSlides(
            data.data.map((slide: any) => ({
              id: slide.id,
              tagLine: slide.tagLine,
              title: slide.title,
              highlight: slide.highlight,
              saleText: slide.saleText,
              description: slide.description,
              buttonText: slide.buttonText,
              buttonLink: slide.buttonLink,
              imageUrl: slide.imageUrl,
              accentColor: slide.accentColor ?? '#D23F57',
            })),
          );
        }
      } catch (error) {
        console.error('Failed to load hero slides', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="pt-4 mt-4 flex items-start gap-4 flex-col lg:flex-row">
        <Swiper
          loop
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Pagination, Autoplay]}
          className="mySwiper flex-1 w-full lg:w-2/3 rounded-3xl overflow-hidden shadow-lg"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={item.id ?? index}>
              <div className="relative w-full h-[360px] md:h-[480px]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 md:px-12 text-white max-w-xl">
                    <p className="text-sm md:text-base tracking-[0.3em] text-gray-200">
                      {item.tagLine}
                    </p>
                    <h3 className="text-4xl md:text-6xl font-semibold mt-2">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-4 text-xl md:text-2xl">
                      <span className="text-white">{item.highlight}</span>
                      <span style={{ color: item.accentColor }}>{item.saleText}</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-100 mt-3 leading-relaxed">
                      {item.description}
                    </p>
                    <a
                      href={item.buttonLink}
                      className="inline-flex px-6 py-2 mt-6 rounded-full text-sm md:text-base font-semibold shadow-lg"
                      style={{ backgroundColor: item.accentColor, color: '#111' }}
                    >
                      {item.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hidden lg:flex lg:flex-col min-w-[30%] space-y-4">
          <div className="relative h-[220px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/banner-17.jpg"
              alt="New Arrivals"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-1/2 -translate-y-1/2 left-8 text-[#2B3445]">
              <p className="text-lg font-semibold tracking-wide">NEW ARRIVALS</p>
              <h6 className="text-3xl font-bold mt-1">SUMMER</h6>
              <p className="text-sm font-light">SALE 20% OFF</p>
              <a
                href="#"
                className="text-sm flex items-center gap-1 mt-3 hover:text-[#D23F57] transition-colors"
              >
                shop now
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative h-[220px] rounded-3xl overflow-hidden shadow-lg">
            <Image src="/images/banner-16.jpg" alt="Gaming" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-1/2 -translate-y-1/2 left-8 text-white drop-shadow">
              <p className="text-lg font-light">GAMING 4K</p>
              <h6 className="text-3xl font-bold mt-1">DESKTOPS &</h6>
              <h6 className="text-3xl font-bold">LAPTOPS</h6>
              <a
                href="#"
                className="text-sm flex items-center gap-1 mt-3 hover:text-[#D23F57] transition-colors"
              >
                shop now
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <IconSection />
    </div>
  );
};

export default Hero;

