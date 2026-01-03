/**
 * =========================================================
 * File: OrderHistory.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - List user's past orders with summary and quick actions.
 *
 * Responsibilities:
 * - Fetch user's orders using Redux thunk
 * - Display skeleton while loading
 * - Handle empty and error states
 * =========================================================
 */


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../redux/slices/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  Calendar, 
  CreditCard, 
  MapPin, 
  ArrowRight, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle
} from "lucide-react";

// --- Helper: Status Colors & Icons ---
const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return { color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} /> };
    case "shipped":
      return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Truck size={14} /> };
    case "cancelled":
      return { color: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle size={14} /> };
    case "processing":
    default:
      return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
  }
};

// --- Skeleton Component ---
const OrderSkeleton = () => (
  <div className="border border-gray-100 rounded-2xl bg-white p-6 animate-pulse mb-4">
    <div className="flex justify-between mb-6">
      <div className="h-6 bg-gray-100 rounded w-1/4"></div>
      <div className="h-6 bg-gray-100 rounded w-20"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
    </div>
  </div>
);

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  useEffect(() => {
    if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return;
  }

    dispatch(fetchMyOrders());
  }, [dispatch ,isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Unable to load orders</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => dispatch(fetchMyOrders())}
          className="text-blue-600 font-semibold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="text-blue-600" size={32} />
              Order History
            </h1>
            <p className="text-gray-500 mt-2">
              Track, return, or buy things again.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              Total Orders: {orders.length}
            </span>
          </div>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <Box size={48} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              It looks like you haven't placed any orders yet. 
              Start shopping to fill this page with amazing products.
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const deliveryDate = new Date(order.createdAt);
              deliveryDate.setDate(deliveryDate.getDate() + 5);
              const statusStyle = getStatusBadge(order.status);

              return (
                <div 
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-1">Order Placed</span>
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-1">Total Amount</span>
                        <span className="font-bold text-gray-900">${order.totalPrice}</span>
                      </div>
                      <div className="hidden sm:block">
                        <span className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-1">Order ID</span>
                        <span className="font-mono text-gray-600">#{order._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle.color}`}>
                      {statusStyle.icon}
                      {order.status}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    <div className="flex-1 w-full space-y-4">
                      {/* Delivery Info */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Delivery Address</p>
                          <p className="text-sm text-gray-500">
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            Est. Delivery: {deliveryDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600 capitalize">
                          Payment via <strong>{order.paymentMethod}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link 
                      to={`/orders/${order._id}`}
                      className="w-full md:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200"
                    >
                      View Order Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;