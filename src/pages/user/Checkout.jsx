/**
 * =========================================================
 * File: Checkout.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Collect shipping address & payment choice and place order.
 *
 * Responsibilities:
 * - Validate address input
 * - Support saved addresses and saving a new address
 * - Apply coupons and calculate total
 * - Redirect to Payment (stripe) or place COD orders
 *
 * Notes:
 * - Relies on protected routes (redirects to /login when unauthenticated)
 * - Clears cart on successful COD order placement
 * =========================================================
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/slices/cartSlice";
import api from "../../config/api";
import { fetchUserMeta } from "../../redux/slices/authSlice";
import { incrementCartCount } from "../../redux/slices/authSlice";
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  Tag, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  User,
  Phone,
  Globe,
  Home,
  Map
} from "lucide-react";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India", // ✅ REQUIRED BY BACKEND
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // ---------------- CALCULATIONS ----------------
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const shippingCost = 0;
  const total = Math.max(subtotal - discountAmount + shippingCost, 0);

  // ---------------- FETCH SAVED ADDRESSES ----------------
  useEffect(() => {

     if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        if (Array.isArray(data.addresses)) {
          setSavedAddresses(data.addresses);
        }
      } catch {
        // silent
      }
    };
    fetchProfile();
  }, [isAuthenticated, navigate]);

  // ---------------- ADDRESS NORMALIZER ----------------
  const normalizeAddressForBackend = (addr) => ({
    name: addr.name,
    phone: addr.phone,
    address: addr.street,          // street → address
    city: addr.city,
    state: addr.state,
    postalCode: addr.zip,           // zip → postalCode
    country: addr.country || "India",
  });

  // ---------------- SELECT ADDRESS ----------------
  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);

    if (index !== -1) {
      const saved = savedAddresses[index];
      setAddress({
        name: saved.name || "",
        phone: saved.phone || "",
        street: saved.address || "",
        city: saved.city || "",
        state: saved.state || "",
        zip: saved.postalCode || "",
        country: saved.country || "India",
      });
      setSaveNewAddress(false);
    } else {
      setAddress({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
      });
    }
  };

  // ---------------- APPLY COUPON ----------------
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    if (couponApplied) {
      toast.info("Coupon already applied");
      return;
    }

    try {
      const { data } = await api.post("/coupons/validate", {
        couponCode: couponCode.toUpperCase(),
      });

      const discountValue =
        data.type === "flat"
          ? data.discount
          : (subtotal * data.discount) / 100;

      setDiscountAmount(discountValue);
      setCouponApplied(true);
      toast.success(`Coupon applied! You saved $${discountValue.toFixed(2)}`);
    } catch {
      toast.error("Invalid or expired coupon");
      setDiscountAmount(0);
    }
  };

  // ---------------- ADDRESS VALIDATION ----------------
  const isAddressValid = () => {
    const requiredFields = [
      address.name,
      address.phone,
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country,
    ];

    return requiredFields.every(
      (field) => field && field.toString().trim() !== ""
    );
  };

  // ---------------- PLACE ORDER ----------------
  const handlePlaceOrder = async () => {
    if (!isAddressValid()) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // SAVE ADDRESS
    if (saveNewAddress && selectedAddressIndex === -1) {
      try {
        await api.post(
          "/users/address",
          normalizeAddressForBackend(address)
        );
      } catch {
        toast.error("Failed to save address to profile");
      }
    }

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.product.title,
        qty: item.qty,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id,
      })),
      shippingAddress: normalizeAddressForBackend(address),
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: 0,
      shippingPrice: shippingCost,
      totalPrice: total,
      couponCode: couponApplied ? couponCode.toUpperCase() : null,
    };

    // ---------------- STRIPE ----------------
    if (paymentMethod === "card") {
      navigate("/payment", {
        state: {
          total,
          address: normalizeAddressForBackend(address),
          items: cartItems,
          orderPayload: orderData,
        },
      });
      return;
    }

    // ---------------- COD ----------------
    try {
      const { data: createdOrder } = await api.post("/orders", orderData);

      // ✅ CLEAR BACKEND CART
      await api.delete("/cart");

      // ✅ CLEAR REDUX CART
      dispatch(clearCart());

      dispatch(incrementCartCount(0));

      dispatch(fetchUserMeta());

      toast.success("Order placed successfully!");

      navigate("/thankyou", {
        state: { order: createdOrder },
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          
          {/* LEFT COLUMN: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SHIPPING ADDRESS SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" /> Shipping Information
              </h2>

              {/* Saved Addresses Grid */}
              {savedAddresses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Saved Addresses</h3>
                  <div className="grid gap-3">
                    {savedAddresses.map((addr, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectAddress(idx)}
                        className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-start gap-3 ${
                          selectedAddressIndex === idx
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                          selectedAddressIndex === idx ? "border-blue-600 bg-blue-600" : "border-gray-400"
                        }`}>
                          {selectedAddressIndex === idx && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">{addr.name}</p>
                          <p className="text-gray-600">{addr.address}, {addr.city}</p>
                          <p className="text-gray-500">{addr.state} - {addr.postalCode}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Option to Add New Address */}
                    <div
                      onClick={() => handleSelectAddress(-1)}
                      className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-center gap-3 ${
                        selectedAddressIndex === -1
                          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        selectedAddressIndex === -1 ? "border-blue-600 bg-blue-600" : "border-gray-400"
                      }`}>
                        {selectedAddressIndex === -1 && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-semibold text-gray-900">Add a New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Form Fields */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300 ${selectedAddressIndex !== -1 ? "opacity-50 pointer-events-none grayscale" : "opacity-100"}`}>
                <div className="md:col-span-2 relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 relative">
                  <Home className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="street"
                    name="street"
                    autoComplete="street-address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Map className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                <input
                  id="zip"
                  name="zip"
                  autoComplete="postal-code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="ZIP / Postal Code"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                />
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  />
                </div>
              </div>

              {/* Save Address Checkbox */}
              {selectedAddressIndex === -1 && (
                <div className="mt-6 flex items-center">
                  <input
                    name="saveAddress"
                    id="save-address"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={saveNewAddress}
                    onChange={(e) => setSaveNewAddress(e.target.checked)}
                  />
                  <label htmlFor="save-address" className="ml-2 block text-sm text-gray-700">
                    Save this address to my profile
                  </label>
                </div>
              )}
            </section>

            {/* 2. PAYMENT METHOD SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stripe / Card Option */}
                <div 
                  onClick={() => setPaymentMethod("card")}
                  className={`cursor-pointer rounded-xl border p-5 flex flex-col items-center justify-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 text-blue-800"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <CreditCard size={32} />
                  <span className="font-semibold">Credit / Debit Card</span>
                  {paymentMethod === "card" && <CheckCircle className="text-blue-600" size={20} />}
                </div>

                {/* COD Option */}
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`cursor-pointer rounded-xl border p-5 flex flex-col items-center justify-center gap-3 transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-600 bg-green-50 ring-1 ring-green-600 text-green-800"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Banknote size={32} />
                  <span className="font-semibold">Cash on Delivery</span>
                  {paymentMethod === "cod" && <CheckCircle className="text-green-600" size={20} />}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Summary & Actions */}
          <div className="lg:col-span-5 mt-8 lg:mt-0 sticky top-24 space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items List (Simplified) */}
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.product?._id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={item.product?.image} alt={item.product?.title} className="h-full w-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${(item.product?.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      id="couponCode"
                      name="couponCode"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      placeholder="Promo Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Coupon applied successfully!
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-bold text-xl pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Main CTA */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 transform active:scale-95 flex items-center justify-center gap-2"
              >
                {paymentMethod === "card" ? "Proceed to Pay" : "Place Order"}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-600" /> Secure Checkout
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={14} className="text-blue-600" /> Fast Shipping
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;