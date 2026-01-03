/**
 * =========================================================
 * File: Footer.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Global site footer.
 *
 * Responsibilities:
 * - Display branding, navigation, contact details
 * - Show social media links and payment methods
 *
 * Notes:
 * - Pure presentational component
 * - No state or business logic
 * =========================================================
 */

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import upi from "../../assets/paymentLogo/upi.png";
import mastercard from "../../assets/paymentLogo/mastercard.png";
import paypal from "../../assets/paymentLogo/paypal.png";
import visa from "../../assets/paymentLogo/visa.png";
import logo from "../../assets/Logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800 pt-16 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        {/* 1. Brand & Vision */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
               <img src={logo} alt="Shopnetic" className="h-8 w-8 object-contain"/>
            </div>
            <span className="text-xl font-bold tracking-tight">Shopnetic<span className="text-blue-600">.</span></span>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            The futuristic shopping hub where innovation meets lifestyle. 
            Curated collections for the modern individual.
          </p>

          <div className="flex space-x-4" data-testid="footer-social-icons">
            {[
              { icon: <Facebook size={18} />, href: "https://facebook.com", color: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
              { icon: <Twitter size={18} />, href: "https://twitter.com", color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]" },
              { icon: <Instagram size={18} />, href: "https://instagram.com", color: "hover:bg-[#E4405F] hover:border-[#E4405F]" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-gray-400 transition-all duration-300 ${social.color} hover:text-white`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2. Navigation Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Explore</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            {['Home', 'Shop Collection', 'My Orders', 'Wishlist'].map((item, idx) => (
              <li key={idx}>
                <a 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-blue-500 transition-colors"></span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Contact & Support */}
        <div >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-blue-500 mt-0.5" />
              <a href="mailto:support@shopnetic.com" className="hover:text-white transition-colors">support@shopnetic.com</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-blue-500 mt-0.5" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 mt-0.5" />
              <span>123 Innovation Blvd, Tech City, CA 90210</span>
            </li>
          </ul>

          {/* Secure Payment Badge */}
          <div className="mt-8">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">Secured Payment</p>
            <div className="flex gap-3 items-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100">
              <img src={visa} alt="Visa" className="h-6 object-contain" />
              <img src={mastercard} alt="Mastercard" className="h-6 object-contain" />
              <img src={paypal} alt="Paypal" className="h-6 object-contain" />
              <img src={upi} alt="UPI" className="h-6 object-contain" />
            </div>
          </div>
        </div>

        {/* 4. Newsletter */}
        <div >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          
          <form className="relative group">
            <input
              id="newsletter-input"
              name="newsletter_email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-gray-700 text-white text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition-colors shadow-lg"
            >
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-3">
            By subscribing, you agree to our Policy and acknowledge you've read our Privacy Notice.
          </p>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 pt-8 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Shopnetic Inc. All rights reserved.
          </p>
            <div className="flex gap-6 text-sm text-gray-500">
          <button
          type="button"
          className="hover:text-white transition-colors"
          >
          Privacy Policy
        </button>

        <button
          type="button"
         className="hover:text-white transition-colors"
        >
       Terms of Service
        </button>

        <button
         type="button"
         className="hover:text-white transition-colors"
        >
          Cookies Settings
        </button>
        </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;