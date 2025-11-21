'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import IconSection from './IconSection';

const sliderData = [
  { text: 'MEN', link: '/images/banner-15.jpg' },
  { text: 'WOMEN', link: '/images/banner-25.jpg' },
];

const Hero = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="pt-2 mt-2.5 flex items-center gap-2 flex-col md:flex-row">
        <Swiper
          loop={true}
          pagination={{ dynamicBullets: true }}
          modules={[Pagination]}
          className="mySwiper flex-1 w-full md:w-2/3 rounded-lg overflow-hidden"
          style={{ height: '400px', minHeight: '400px' }}
        >
          {sliderData.map((item) => (
            <SwiperSlide key={item.link}>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={item.link}
                  alt={item.text}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 p-4 md:left-[10%] text-left z-10">
                    <h5 className="text-[#222] text-lg md:text-xl">LIFESTYLE COLLECTION</h5>
                    <h3 className="text-[#222] font-medium my-1 text-2xl md:text-4xl">
                      {item.text}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start">
                      <h4 className="text-[#333] mr-1 text-xl md:text-2xl">SALE UP TO</h4>
                      <h4 className="text-[#D23F57] text-xl md:text-2xl">30% OFF</h4>
                    </div>
                    <p className="text-black font-light my-1 text-sm md:text-base">
                      Get Free Shipping on orders over $99.00
                    </p>
                    <button className="px-5 py-1 mt-2 bg-[#454343] text-white rounded hover:bg-[#827a7a] transition-colors shadow-md">
                      shop now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hidden md:block min-w-[26.6%] space-y-2">
          <div className="relative">
            <Image
              src="/images/banner-17.jpg"
              alt="New Arrivals"
              width={300}
              height={240}
              className="w-full rounded-lg"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-8">
              <p className="text-[#2B3445] text-lg">NEW ARRIVALS</p>
              <h6 className="text-[#2B3445] leading-4 mt-1">SUMMER</h6>
              <h6 className="text-[#2B3445]">SALE 20% OFF</h6>
              <a
                href="#"
                className="text-[#2B3445] flex items-center gap-1 hover:text-[#D23F57] transition-colors"
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

          <div className="relative">
            <Image
              src="/images/banner-16.jpg"
              alt="Gaming"
              width={300}
              height={240}
              className="w-full rounded-lg"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-8">
              <p className="text-[#2B3445] text-lg font-light">GAMING 4K</p>
              <h6 className="text-[#2B3445] leading-4 mt-1">DESKTOPS &</h6>
              <h6 className="text-[#2B3445]">LAPTOPS</h6>
              <a
                href="#"
                className="text-[#2B3445] flex items-center gap-1 hover:text-[#D23F57] transition-colors"
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

