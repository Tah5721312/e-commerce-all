'use client';

import { FiZap, FiAward, FiClock, FiCreditCard } from 'react-icons/fi';

interface IconBoxProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
}

const IconBox = ({ icon, title, subTitle }: IconBoxProps) => {
  return (
    <div className="flex items-center gap-3 py-1.6 flex-1 justify-center md:justify-center min-w-[250px]">
      <div className="text-2xl text-gray-700">{icon}</div>
      <div>
        <p className="text-base">{title}</p>
        <p className="text-base font-light text-gray-600">{subTitle}</p>
      </div>
    </div>
  );
};

const IconSection = () => {
  return (
    <div className="container mx-auto px-4 mt-3 bg-white">
      <div className="flex flex-wrap items-center divide-y md:divide-y-0 md:divide-x divide-gray-300">
        <IconBox
          icon={<FiZap />}
          title="Fast Delivery"
          subTitle="Start from $10"
        />
        <IconBox
          icon={<FiAward />}
          title="Money Guarantee"
          subTitle="7 Days Back"
        />
        <IconBox
          icon={<FiClock />}
          title="365 Days"
          subTitle="For free return"
        />
        <IconBox
          icon={<FiCreditCard />}
          title="Payment"
          subTitle="Secure system"
        />
      </div>
    </div>
  );
};

export default IconSection;

