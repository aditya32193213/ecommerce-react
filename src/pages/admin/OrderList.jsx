/**
 * =========================================================
 * File: OrderList.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Provide an admin-facing list of orders with search and pagination.
 *
 * Responsibilities:
 * - Fetch and present orders via admin endpoint.
 * - Allow navigation to order details.
 * - Present status badges, search and basic filters.
 *
 * Notes:
 * - Uses /orders/admin endpoint.
 * =========================================================
 */

import React, { useEffect, useState ,useCallback} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import BackButton from "../../components/admin/BackButton";
import { 
  ShoppingBag, 
  Search, 
  User, 
  DollarSign, 
  Filter, 
  Calendar,
  Hash,
  ArrowRightCircle
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH ORDERS (Logic Preserved) =================
  const fetchOrders = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await api.get(
      `/orders/admin?page=${page}&keyword=${keyword}`
    );
    setOrders(data.orders || []);
    setPages(data.pages || 1);
  } catch (err) {
    toast.error("Failed to fetch orders");
  } finally {
    setLoading(false);
  }
}, [page, keyword]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Status Badge Helper
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <span className="text-slate-400 font-medium">/ Sales Pipeline</span>
        </div>

        {/* ================= PREMIUM HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Order Management <span className="text-2xl">🧾</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Monitor transaction flow and fulfillment statuses in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
              {orders.length}
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Active</p>
              <p className="text-sm font-bold text-slate-700">Orders this page</p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & FILTERS ================= */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="order-search"
              name="search"
              type="text"
              placeholder="Search by customer name... 👤"
              value={keyword}
              onChange={(e) => {
                setPage(1);
                setKeyword(e.target.value);
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          
          <button className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors font-bold text-sm">
            <Filter size={18} />
            Advanced Filters
          </button>
        </div>

        {/* ================= TABLE CONTAINER ================= */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Hash size={12}/> Order Identity</div>
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><User size={12}/> Customer</div>
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><DollarSign size={12}/> Total Amount</div>
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status ⚡
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actions ⚙️
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="size-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">Scanning Neural Network...</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <ShoppingBag size={32} />
                        </div>
                        <p className="text-slate-500 font-bold italic">No transactions detected.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            #{order._id}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 flex items-center gap-1">
                            <Calendar size={10}/> Order Node: {order._id.substring(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {order.user?.name || "Anonymous Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-black text-slate-900">
                          ${order.totalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all group/btn"
                        >
                          View Details
                          <ArrowRightCircle size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PREMIUM PAGINATION ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing Node {page} of {pages}
          </p>
          <div className="flex items-center gap-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x}
                onClick={() => setPage(x + 1)}
                className={`min-w-[40px] h-10 rounded-xl font-bold text-xs transition-all ${
                  page === x + 1 
                    ? "bg-[#0F172A] text-white shadow-lg shadow-slate-200 scale-110" 
                    : "bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200"
                }`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;