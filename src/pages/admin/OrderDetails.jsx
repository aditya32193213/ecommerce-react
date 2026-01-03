/**
 * =========================================================
 * File: OrderDetails.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Display detailed information for a specific order.
 *
 * Responsibilities:
 * - Fetch order details by ID from backend
 * - Allow admin to update order status and download invoice
 * - Present customer, shipping, itemized and financial information
 *
 * Notes:
 * - Uses route param `id` to fetch order: GET /orders/:id
 * =========================================================
 */

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import { 
  CheckCircle2, 
  XCircle, 
  Package,  
  CreditCard, 
  User, 
  MapPin, 
  Download, 
  ArrowRight,
  Clock,
  Receipt
} from "lucide-react";
import BackButton from "../../components/admin/BackButton";

const STATUSES = ["Placed", "Processing", "Shipped", "Delivered"];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ORDER (Logic Preserved) =================
  const fetchOrder = useCallback(async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order details ❌");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // ================= UPDATE STATUS (Logic Preserved) =================
  const updateStatusHandler = async () => {
    try {
      await api.put(`/orders/${id}/status`);
      toast.success("Logistics updated! 🚀");
      fetchOrder();
    } catch (err) {
      console.error(err);
      toast.error("Status update failed ⚠️");
    }
  };

  // ================= DOWNLOAD INVOICE (Logic Preserved) =================
  const downloadInvoiceHandler = async () => {
    try {
      const response = await api.get(`/orders/${id}/invoice`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Invoice generation failed 📑");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="size-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Fetching Transaction Node...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center gap-3">
        <span>⚠️</span> Reference ID: {id} - Record Not Found.
      </div>
    );
  }

  const currentIndex = STATUSES.indexOf(order.status || "Placed");

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ================= BREADCRUMBS & ACTIONS ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <BackButton />
              <span className="text-slate-400 text-sm font-medium">/ Order Archive</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Order Details <span className="text-2xl">📑</span>
            </h1>
            <p className="text-xs font-mono font-bold text-slate-400">UUID: {order._id}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadInvoiceHandler}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <Download size={18} /> Download Invoice
            </button>
            
            {order.status !== "Delivered" && (
              <button
                onClick={updateStatusHandler}
                className="px-6 py-3 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-200"
              >
                Promote Status <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT COLUMN: CUSTOMER & LOGISTICS ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Timeline Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Clock size={16} /> Fulfillment Timeline
              </h2>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {STATUSES.map((status, index) => (
                  <React.Fragment key={status}>
                    <div className="flex flex-col items-center text-center group">
                      <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        index <= currentIndex 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                        : "bg-slate-100 text-slate-300 border border-slate-200"
                      }`}>
                        {index <= currentIndex ? <CheckCircle2 size={24} /> : <div className="size-2 bg-slate-300 rounded-full" />}
                      </div>
                      <span className={`mt-3 text-xs font-black uppercase tracking-tighter ${
                        index <= currentIndex ? "text-slate-900" : "text-slate-400"
                      }`}>{status}</span>
                    </div>
                    {index < STATUSES.length - 1 && (
                      <div className={`hidden md:block flex-1 h-0.5 mx-2 rounded-full ${
                        index < currentIndex ? "bg-emerald-500" : "bg-slate-100"
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Items Table Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} /> Manifest Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-50">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Description</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.orderItems.map((item) => (
                      <tr key={item._id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">{item.qty}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-medium text-slate-500">${item.price}</span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                          ${(item.qty * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SUMMARY & ADDRESS ================= */}
          <div className="space-y-8">
            
            {/* Customer & Shipping Information */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                    <p className="text-sm font-bold text-slate-900">{order.user?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{order.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping To</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mt-1">
                      {order.shippingAddress.address},<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode},<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">Payment: {order.paymentMethod}</span>
                    </div>
                    {order.isPaid ? (
                      <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase">
                        <CheckCircle2 size={12} /> Paid
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 uppercase">
                        <XCircle size={12} /> Unpaid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <Receipt className="absolute -bottom-4 -right-4 size-32 text-white/5" />
              <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Financial Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="font-bold">${order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Shipping Fee</span>
                  <span className="font-bold">${order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Taxation</span>
                  <span className="font-bold">${order.taxPrice}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-blue-400">Total Payable</span>
                  <span className="text-3xl font-black">${order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;