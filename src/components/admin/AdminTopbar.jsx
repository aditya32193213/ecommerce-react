/**
 * =========================================================
 * File: AdminTopbar.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display the top navigation bar for admin pages.
 *
 * Responsibilities:
 * - Show search input and notification icon
 * - Provide logout functionality
 * - Trigger sidebar toggle on mobile
 *
 * Notes:
 * - Uses Redux for logout
 * - Sticky positioned for persistent visibility
 * =========================================================
 */

import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, Menu, Command } from "lucide-react";

export default function AdminTopbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all"
        >
          <Menu className="size-6" />
        </button>

        {/* Command Search */}
        <div className="relative group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400" />
          <input
            id="global-search"
            name="search"
            type="text"
            className="w-64 lg:w-96 pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white transition-all focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none"
            placeholder="Search commands... 🔍"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg text-[10px] text-slate-400 font-bold border border-white/10">
            <Command className="size-3" /> <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button className="relative p-3 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-2xl transition-all group">
          <Bell className="size-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-[#0F172A] rounded-full shadow-lg"></span>
        </button>

        <div className="h-10 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-4 group">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-black text-white tracking-tight">Admin Master 👑</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Verified Mode</span>
          </div>
          
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar" 
            className="size-11 rounded-2xl border-2 border-white/10 shadow-2xl group-hover:border-blue-500/50 transition-all cursor-pointer"
          />

          <button
            onClick={handleLogout}
            className="p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-95"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}