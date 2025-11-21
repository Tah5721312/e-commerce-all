'use client';

const Footer = () => {
  return (
    <div className="bg-[#2B3445] py-1.3 rounded-t-lg">
      <div className="flex justify-center items-center text-white">
        <p className="text-xs sm:text-lg">
          Designed and developed by
          <button className="mx-0.5 text-[#ff7790] text-xs sm:text-lg capitalize hover:underline">
            Mohamed Abdelftah
          </button>
          ©2025
        </p>
      </div>
    </div>
  );
};

export default Footer;

