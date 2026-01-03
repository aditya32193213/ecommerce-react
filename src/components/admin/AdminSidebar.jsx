/**
 * =========================================================
 * File: AdminSidebar.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Render the left navigation sidebar for admin panel.
 *
 * Responsibilities:
 * - Display admin navigation links
 * - Highlight active route
 * - Handle mobile open/close behavior
 *
 * Notes:
 * - Responsive for mobile and desktop
 * - Uses NavLink for route awareness
 * =========================================================
 */

import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingBag, 
  Users, X, Sparkles 
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation(); // Hook to fix the 'location' error

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, emoji: "📊" },
    { name: "Products", path: "/admin/products", icon: Package, emoji: "📦" },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag, emoji: "🛍️" },
    { name: "Users", path: "/admin/users", icon: Users, emoji: "👥" },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60] transition-opacity duration-500 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#0F172A] text-slate-400 border-r border-white/5 
        transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.4)]" : "-translate-x-full"}
      `}>
        {/* Brand Section */}
        <div className="relative p-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Sparkles className="text-white size-5 fill-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tight italic">Shopnetic ✨</span>
              <span className="text-[10px] font-bold text-blue-400/80 tracking-[0.3em] uppercase">Admin Dashboard</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
            <X className="size-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 z-10 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-6 opacity-80">
            Main Management 🛠️
          </p>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? "bg-white/[0.05] text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]" 
                    : "hover:bg-white/[0.02] hover:text-slate-100"}
                `}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-lg group-hover:scale-125 transition-transform duration-300">{item.emoji}</span>
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                </div>
                {isActive && <div className="size-1.5 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6]" />}
              </NavLink>
            );
          })}
        </nav>

        {/* System Footer */}
        <div className="p-6">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 rounded-[2rem] p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Live Status 🟢</span>
            </div>
            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full w-[85%] rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}