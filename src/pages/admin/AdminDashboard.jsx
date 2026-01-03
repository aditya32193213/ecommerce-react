/**
 * =========================================================
 * File: AdminDashboard.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Provide an executive overview dashboard for administrators.
 *
 * Responsibilities:
 * - Fetch platform statistics and display KPIs and charts.
 * - Visualize order/revenue trends, status distribution and general metrics.
 * - Offer report download and quick insights.
 *
 * Notes:
 * - Uses Recharts for visualizations.
 * - Reads data from backend endpoint: /dashboard/admin
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import api from "../../config/api.js";
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Users, Package, DollarSign, ShoppingBag, Activity } from "lucide-react";

// Updated SaaS Color Palette for Light Mode
const COLORS = {
  primary: "#2563eb", // Royal Blue
  success: "#059669", // Emerald
  warning: "#d97706", // Amber
  danger: "#e11d48",  // Rose
  indigo: "#4f46e5",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    400: "#94a3b8",
    500: "#64748b",
    900: "#0f172a"
  }
};

const STATUS_COLORS = [COLORS.primary, COLORS.warning, COLORS.success, COLORS.danger];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH STATS (Logic Preserved) =================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/admin");
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Synchronizing Data... 🔄</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center gap-3">
        <span>⚠️</span> Failed to establish connection with the central node.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 bg-[#F8FAFC] min-h-screen text-slate-600">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Executive Overview <span className="animate-bounce">🚀</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Real-time platform analytics and system performance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200 transition-transform active:scale-95 hover:bg-slate-800">
            Download Report 📥
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="blue" 
          emoji="🛍️"
          trend="+12.5%"
        />
        <StatCard 
          title="Active Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="indigo" 
          emoji="👥"
          trend="+5.2%"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
          color="emerald" 
          emoji="📦"
          trend="Stable"
        />
        <StatCard 
          title="Net Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="amber" 
          emoji="💰"
          trend="+18.4%"
        />
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Orders Trend Area Chart */}
        <ChartContainer title="Order Volume Trend" subtitle="Daily transaction frequency" emoji="📈">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={stats.ordersByDate}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{stroke: '#cbd5e1', strokeWidth: 2}} />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Revenue Bar Chart */}
        <ChartContainer title="Revenue Analytics" subtitle="Monetary flow by date" emoji="💵">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip currency />} />
              <Bar 
                dataKey="revenue" 
                fill={COLORS.success} 
                radius={[6, 6, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Orders by Status Pie Chart */}
        <div className="lg:col-span-2">
          <ChartContainer title="Distribution by Status" subtitle="Order lifecycle segmentation" emoji="🎯">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    dataKey="count"
                    nameKey="_id"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4 px-8">
                {stats.ordersByStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
                      <span className="text-sm font-bold text-slate-700 capitalize">{item._id}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component (Light Mode)
const StatCard = ({ title, value, icon: Icon, color, emoji, trend }) => (
  <div className="group relative bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 shadow-sm`}>
          <Icon size={22} />
        </div>
        <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg uppercase tracking-wider border border-emerald-100">
          {trend}
        </span>
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em]">{title} {emoji}</h3>
      <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{value}</p>
    </div>
  </div>
);

// Reusable Chart Wrapper (Light Mode)
const ChartContainer = ({ title, subtitle, children, emoji }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          {title} <span className="text-base">{emoji}</span>
        </h2>
        <p className="text-slate-500 text-xs font-medium mt-1">{subtitle}</p>
      </div>
      <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
        <Activity size={18} />
      </button>
    </div>
    {children}
  </div>
);

// Custom Tooltip for Recharts (Light Mode)
const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xl">
        <p className="text-slate-400 text-[10px] font-bold uppercase mb-2">{label}</p>
        <p className="text-blue-600 font-black text-lg">
          {currency ? `$${payload[0].value.toLocaleString()}` : `${payload[0].value} Units`}
        </p>
      </div>
    );
  }
  return null;
};

export default AdminDashboard;