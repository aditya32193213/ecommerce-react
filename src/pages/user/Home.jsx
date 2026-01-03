/**
 * =========================================================
 * File: Home.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Landing / home page for the shop: hero, features, product grid.
 *
 * Responsibilities:
 * - Fetch product list for hero and grid
 * - Render featured sections and trust badges
 *
 * Notes:
 * - Uses fetchProducts thunk to populate product grid.
 * =========================================================
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../redux/slices/productSlice";
import ProductCard from "../../components/product/ProductCard";
import WhatWeBelieve from "../../components/home/whatwebelieve"; // ✅ Component Preserved
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  CreditCard,
  CheckCircle,
  Package,
} from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // --- 1. Premium Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Curating Experience</p>
        </div>
      </div>
    );
  }

  // --- 2. Error State ---
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl border border-red-50">
          <Zap size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Interrupted</h2>
          <p className="text-gray-500 mb-6">We couldn't retrieve the latest collections.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ==================== 1. HERO SECTION (Aurora Style) ==================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-semibold uppercase tracking-wide mb-8 hover:border-blue-300 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            New Collection 2026
          </div>
          
          <h1 data-aos="fade-up" data-aos-delay="100" className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.05]">
            Redefine Your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Everyday Style.
            </span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="200" className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Discover premium apparel and accessories curated for the modern individual. 
            Quality craftsmanship meets contemporary design logic.
          </p>

          <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/shop" className="group px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all hover:shadow-xl hover:shadow-blue-900/20 transform hover:-translate-y-1 flex items-center gap-2">
              Start Shopping <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 2. TRUSTED BY (Monochrome) ==================== */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by 10,000+ Customers</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 text-xl font-bold font-serif"><Globe /> ACME Inc.</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono"><Zap /> BoltShift</div>
            <div className="flex items-center gap-2 text-xl font-bold"><Award /> Luminous</div>
            <div className="flex items-center gap-2 text-xl font-bold font-sans"><ShieldCheck /> Spherule</div>
          </div>
        </div>
      </section>

      {/* ==================== 3. BENTO GRID FEATURES ==================== */}
      <section className="py-32 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Why We Are Different</h2>
          <p className="text-gray-500 text-xl leading-relaxed">We don't just sell products; we deliver an experience backed by guarantees that actually matter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Card 1: Global Shipping (Large) */}
          <div data-aos="fade-right" className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 md:p-14 text-white relative overflow-hidden group">
            <Globe className="absolute -bottom-10 -right-10 w-80 h-80 text-white opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 ease-out" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Global Shipping Network</h3>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed">We ship to over 50 countries with real-time tracking and automated customs handling.</p>
            </div>
          </div>

          {/* Card 2: Secure Payments */}
          <div data-aos="fade-left" className="bg-gray-50 border border-gray-100 rounded-[2rem] p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-500 leading-relaxed">Powered by Stripe. 100% encrypted transactions.</p>
          </div>

          {/* Card 3: Packaging */}
          <div data-aos="fade-up" className="bg-gray-50 border border-gray-100 rounded-[2rem] p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-8 text-purple-600 group-hover:scale-110 transition-transform">
              <Package size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Packaging</h3>
            <p className="text-gray-500 leading-relaxed">Unboxing is half the fun. We ensure your items arrive in style.</p>
          </div>

          {/* Card 4: Guarantee (Large) */}
          <div data-aos="fade-up" data-aos-delay="100" className="md:col-span-2 bg-gray-900 rounded-[2rem] p-10 md:p-14 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-gray-900 opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <CreditCard size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Money Back Guarantee</h3>
                <p className="text-gray-400 text-lg leading-relaxed">Not satisfied? Return it within 30 days for a full refund.</p>
              </div>
              <div className="flex-1 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-full max-w-sm shadow-2xl transform md:rotate-2 group-hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                    <CheckCircle className="text-emerald-400" size={24} />
                    <div><span className="block font-bold text-sm">Instant Refund</span><span className="text-xs text-gray-400">Processed in 24h</span></div>
                 </div>
                 <div className="flex items-center gap-4">
                    <CheckCircle className="text-emerald-400" size={24} />
                    <div><span className="block font-bold text-sm">Free Returns</span><span className="text-xs text-gray-400">Label included</span></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. TRENDING PRODUCTS ==================== */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div data-aos="fade-right">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Top Picks</span>
              <h2 className="text-4xl font-bold text-gray-900">Featured Drops</h2>
            </div>
            <Link to="/shop" className="group hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
              View Full Catalog <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.slice(0, 4).map((product, idx) => (
              <div key={product._id} data-aos="fade-up" data-aos-delay={idx * 100}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. WHAT WE BELIEVE (Original Component) ==================== */}
      {/* This section wraps your original 'WhatWeBelieve' component 
          with the new SaaS styling wrapper for consistency.
      */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="container mx-auto px-6" data-aos="fade-up">
           <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Philosophy</h2>
              <p className="text-gray-500 text-lg">The principles that drive every decision we make.</p>
           </div>
           
           {/* ✅ YOUR COMPONENT HERE */}
           <WhatWeBelieve />
           
        </div>
      </section>

      {/* ==================== 6. CTA / FOOTER PREVIEW ==================== */}
      <section className="py-32 container mx-auto px-6">
        <div data-aos="zoom-in" className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-gray-900/50">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-30 mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-30 mix-blend-screen animate-pulse"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to elevate your lifestyle?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl transform hover:-translate-y-1">Get Started</Link>
               <Link to="/shop" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-900 transition">Browse Store</Link>
            </div>
            <p className="text-gray-500 text-xs mt-8 font-medium uppercase tracking-widest">No credit card required for signup</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;