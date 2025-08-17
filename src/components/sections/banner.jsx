/**
 * Banner Component
 * -----------------
 * File: banner.jsx
 * Purpose: Displays a promotional banner at the top of the page 
 * along with a back navigation button.
 * 
 * Features:
 *  - Shows a background image banner with fixed positioning
 *  - Highlights a promotional offer with discount code
 *  - Responsive heading and promo badge styles
 *  - Includes reusable BackButton component below banner
 */

import React from 'react';
import bannerImage from '../../assets/banner/banner.jpg'; //  Import banner background image
import BackButton from '../common/BackButton'; // Import reusable BackButton component

const Banner = () => {
  return (
    <>
      {/*Banner section with background image */}
      <div
        className="h-[100px] bg-fixed bg-cover bg-center flex items-center justify-between px-6 text-white"
        style={{ backgroundImage: `url(${bannerImage})` }} // Apply imported banner image
        data-testid="banner-wrapper"
      >
        {/* Banner heading */}
        <h2
          className="text-xl md:text-2xl font-bold"
          data-testid="banner-heading"
        >
          Explore Trending Products!
        </h2>

        {/* Promo badge with discount info */}
        <span
          className="bg-red-600 text-white px-4 py-1 rounded-full text-sm md:text-base font-semibold animate-pulse"
          data-testid="promo-badge"
        >
          50% Discount Sale!<br />
          Promo Code:FLAT50
        </span>
      </div>

      {/* Back button displayed below banner */}
      <BackButton />
    </>
  );
};

export default Banner; //  Export Banner component for use across app
