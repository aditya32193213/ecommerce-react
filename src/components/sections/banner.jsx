import React from 'react';
import bannerImage from '../../assets/banner/banner.jpg';
import BackButton from '../Common/BackButton';

const Banner = () => {
  return (
    <>
      <div
        className="h-[100px] bg-fixed bg-cover bg-center flex items-center justify-between px-6 text-white"
        style={{ backgroundImage: `url(${bannerImage})` }}
        data-testid="banner-wrapper"
      >
        <h2
          className="text-xl md:text-2xl font-bold"
          data-testid="banner-heading"
        >
          Explore Trending Products!
        </h2>
        <span
          className="bg-red-600 text-white px-4 py-1 rounded-full text-sm md:text-base font-semibold animate-pulse"
          data-testid="promo-badge"
        >
          50% Discount Sale!<br />
          Promo Code:FLAT50
        </span>
      </div>
      <BackButton />
    </>
  );
};

export default Banner;
