import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import upi from "../assets/paymentLogo/upi.png";
import mastercard from "../assets/paymentLogo/mastercard.png";
import paypal from "../assets/paymentLogo/paypal.png";
import visa from "../assets/paymentLogo/visa.png";
import logo from "../assets/Logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 pt-2 pb-3 mt-2" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Company Info */}
        <div data-testid="footer-company-info">
          <div className="mb-4">
            <img src={logo} alt="Shopnetic Logo" className="h-20 w-20" data-testid="footer-logo" />
          </div>
          <p className="text-sm leading-relaxed">
            Shopnetic is your futuristic shopping hub where innovation meets lifestyle.
          </p>
          <div className="flex space-x-4 mt-4" data-testid="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} className="hover:text-blue-500" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} className="hover:text-blue-400" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} className="hover:text-pink-500" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div data-testid="footer-quick-links">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/cart" className="hover:underline">Cart</a></li>
            <li><a href="/wishlist" className="hover:underline">Wishlist</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div data-testid="footer-contact-info">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm">Email: <a href="mailto:support@shopnetic.com" className="hover:underline">support@shopnetic.com</a></p>
          <p className="text-sm mt-2">Phone: <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a></p>
          <div className="mt-4 flex space-x-2" data-testid="footer-payment-icons">
            <img src={visa} alt="Visa" className="h-6" />
            <img src={mastercard} alt="MasterCard" className="h-6" />
            <img src={upi} alt="UPI" className="h-6" />
            <img src={paypal} alt="PayPal" className="h-6" />
          </div>
        </div>

        {/* Newsletter */}
        <div data-testid="footer-newsletter">
          <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded text-white border border-white bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="footer-email-input"
            />
            <button
              type="submit"
              className="bg-blue-600 py-2 rounded text-white hover:bg-blue-700 transition"
              data-testid="footer-subscribe-button"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 text-sm text-gray-500" data-testid="footer-bottom">
        © {new Date().getFullYear()} Shopnetic. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
