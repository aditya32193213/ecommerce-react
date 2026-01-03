/**
 * =========================================================
 * File: Dashboard.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - User dashboard landing showing quick actions and navigation.
 *
 * Responsibilities:
 * - Display welcome message with username
 * - Provide quick links to Orders, Profile, and Settings
 *
 * Notes:
 * - Purely presentational and relies on Redux for username.
 * =========================================================
 */

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package, User, ChevronRight, Settings } from "lucide-react";

const Dashboard = () => {
  const { username } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{username}</span>!
          </h1>
          <p className="text-gray-500 text-lg">
            Manage your orders, update your profile, and check your account status.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Orders Card */}
          <Link 
            to="/orders" 
            className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package size={100} className="text-blue-600" />
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Package size={28} />
              </div>
              <div className="bg-gray-50 rounded-full p-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              My Orders
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track active shipments, download invoices, and view your purchase history.
            </p>
          </Link>

          {/* 2. Profile Card */}
          <Link 
            to="/profile" 
            className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={100} className="text-green-600" />
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                <User size={28} />
              </div>
              <div className="bg-gray-50 rounded-full p-2 text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              My Profile
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Update your personal information, manage shipping addresses, and security settings.
            </p>
          </Link>

          {/* 3. Settings / Coming Soon (Optional visual filler for 3-col grid) */}
          <div className="group bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <Settings size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-500">Account Settings</h3>
            <p className="text-xs text-gray-400 mt-1">More features coming soon</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;