/**
 * =========================================================
 * File: OrderDetails.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Show a single order's details: items, shipping, payment, timeline.
 *
 * Responsibilities:
 * - Load order by ID using Redux thunk
 * - Allow invoice download (authenticated)
 * - Allow canceling the order (if eligible)
 *
 * Notes:
 * - Handles secure invoice download by reading auth token from localStorage.
 * =========================================================
 */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, cancelOrder } from "../../redux/slices/orderSlice";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  FileText, 
  AlertTriangle, 
  Package, 
  CheckCircle, 
  Clock, 
  Truck
} from "lucide-react";
import { toast } from "react-toastify";

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    delivered: "bg-green-100 text-green-700 border-green-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    processing: "bg-amber-100 text-amber-700 border-amber-200",
  };
  
  const icons = {
    delivered: <CheckCircle size={14} />,
    shipped: <Truck size={14} />,
    cancelled: <AlertTriangle size={14} />,
    processing: <Clock size={14} />,
  };

  const key = status?.toLowerCase() || "processing";
  
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[key] || styles.processing}`}>
      {icons[key] || icons.processing}
      {status}
    </span>
  );
};

const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
      </div>
      <div className="h-96 bg-gray-100 rounded-2xl"></div>
    </div>
  </div>
);

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {

    if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return;
    }
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id ,isAuthenticated ,navigate]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await dispatch(cancelOrder(order._id)).unwrap();
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  // ✅ Secure Invoice Download Logic
  const handleDownloadInvoice = async (e) => {
    e.preventDefault();
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      if (!token) {
        toast.error("Please login again to download invoice");
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${order._id}/invoice`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || "Invoice download failed");
    }
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <div className="text-center mt-20 text-red-500 font-medium">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate("/orders")} 
              className="flex items-center text-gray-500 hover:text-gray-900 transition mb-2 text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Orders
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
               Placed on{" "}
                 {order.createdAt
               ? new Date(order.createdAt).toLocaleString()
             : "N/A"}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Invoice Button */}
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              <FileText size={16} /> Invoice
            </button>
            
            {/* Cancel Button */}
            {!order.isDelivered && order.status !== "Cancelled" && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition shadow-sm"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Details --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                <h2 className="font-bold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6 divide-y divide-gray-100">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="h-20 w-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-contain mix-blend-multiply" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${item.price}</p>
                      <p className="text-sm text-gray-500">${(item.price * item.qty).toFixed(2)} Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Timeline / Status History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" /> Order Timeline
              </h2>
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                {/* Initial State */}
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                  <p className="font-semibold text-gray-900 text-sm">Order Placed</p>
                  <p className="text-xs text-gray-500">{order.createdAt?new Date(order.createdAt).toLocaleString(): "N/A"}</p>
                </div>

                {/* Dynamic Status History */}
                {order.statusHistory?.filter(s => s.status !== "Placed").map((s, i) => (
                <div key={i} className="relative pl-8">
                <p className="font-semibold text-gray-900 text-sm capitalize">
                 {s.status}
               </p>
               <p className="text-xs text-gray-500">
                {s.date ? new Date(s.date).toLocaleString() : "Pending"}
               </p>
               </div>
                ))}
                {/* Delivered State */}
                {order.isDelivered && order.deliveredAt && (
                 <p className="text-xs text-gray-500">
                {new Date(order.deliveredAt).toLocaleString()}
                 </p>
                )}
              </div>
            </div>
          </div>

          {/* --- Right Column: Summary & Info --- */}
          <div className="space-y-6">
            
            {/* 1. Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice || order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${order.taxPrice || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${order.shippingPrice || 0}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {/* 2. Customer & Shipping Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              {/* Shipping */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <MapPin size={16} className="text-gray-400" /> Shipping Address
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-900">{order.user?.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <CreditCard size={16} className="text-gray-400" /> Payment Info
                </h3>
                <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-gray-600">Method</span>
                  <span className="font-bold text-gray-900 uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-bold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
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