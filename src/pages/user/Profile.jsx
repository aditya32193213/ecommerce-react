/**
 * =========================================================
 * File: Profile.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - User profile and address management page.
 *
 * Responsibilities:
 * - Fetch and update user profile
 * - CRUD operations for user addresses
 *
 * Notes:
 * - Uses normalization helpers to convert between backend/frontend address formats.
 * =========================================================
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../config/api";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Phone, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Globe,
  Home
} from "lucide-react";

/* ================================
   Address helpers (PRESERVED)
================================ */

const emptyAddress = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

// Backend → Frontend
const normalizeFromBackend = (addr = {}) => ({
  _id: addr._id,
  name: addr.name || "",
  phone: addr.phone || "",
  street: addr.address || "",
  city: addr.city || "",
  state: addr.state || "",
  zip: addr.postalCode || "",
  country: addr.country || "",
});

// Frontend → Backend
const normalizeToBackend = (addr) => ({
  name: addr.name,
  phone: addr.phone,
  address: addr.street,
  city: addr.city,
  state: addr.state,
  postalCode: addr.zip,
  country: addr.country,
});

const Profile = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  /* ================================
     Fetch profile
  ================================ */
  useEffect(() => {

    if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");

        setName(data.name);
        setEmail(data.email);

        const normalized = (data.addresses || []).map(normalizeFromBackend);
        setAddresses(normalized);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [dispatch,isAuthenticated, navigate]);

  /* ================================
     Profile update
  ================================ */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await api.put("/users/profile", {
        name,
        password: password || undefined,
      });

      dispatch(login({ username: data.name, token: data.token, isAdmin }));
      toast.success("Profile updated");

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  /* ================================
     Save / Update address
  ================================ */
  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.zip || !addressForm.country) {
      return toast.error("Street, Zip and Country are required");
    }

    try {
      let res;

      if (editingIndex !== null) {
        const id = addresses[editingIndex]._id;
        res = await api.put(
          `/users/address/${id}`,
          normalizeToBackend(addressForm)
        );
        toast.success("Address updated");
      } else {
        res = await api.post(
          "/users/address",
          normalizeToBackend(addressForm)
        );
        toast.success("Address added");
      }

      setAddresses(res.data.addresses.map(normalizeFromBackend));
      setAddressForm(emptyAddress);
      setEditingIndex(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  /* ================================
     Delete address
  ================================ */
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const { data } = await api.delete(`/users/address/${id}`);
      setAddresses(data.addresses.map(normalizeFromBackend));
      toast.success("Address deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================================
     Edit address
  ================================ */
  const startEdit = (index) => {
    setEditingIndex(index);
    setAddressForm(addresses[index]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your profile, security, and shipping addresses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Profile & Security --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-blue-600" size={20} /> Profile & Security
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="profile-name" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      id="profile-name"    
                      name="name"           
                      autoComplete="name"    
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email (Disabled) */}
                <div className="space-y-1">
                  <label htmlFor="profile-email" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      id="profile-email"    
                      name="email"           
                      autoComplete="email"   
                      value={email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Password Reset */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="new-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        id="new-password"          
                        name="newPassword"         
                        autoComplete="new-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirm-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        id="confirm-password"       
                        name="confirmPassword"      
                        autoComplete="new-password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Address Book --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Address List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} /> Address Book
              </h2>

              {addresses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Home className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-gray-500">No addresses saved yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr, i) => (
                    <div 
                      key={addr._id} 
                      className="group p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/10 transition-all relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{addr.name || name}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(i)} 
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(addr._id)} 
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{addr.street}, {addr.city}</p>
                        <p>{addr.state} - {addr.zip}</p>
                        <p className="flex items-center gap-1.5 mt-2 text-xs font-medium text-gray-500">
                          <Globe size={12} /> {addr.country}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Phone size={12} /> {addr.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Add / Edit Address Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                {editingIndex !== null ? <Edit2 className="text-amber-500" size={20} /> : <Plus className="text-green-500" size={20} />}
                {editingIndex !== null ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    id="addr-name"         
                    name="addressName"      
                    autoComplete="name"      
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    placeholder="Contact Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    id="addr-phone"          
                    name="addressPhone"      
                    autoComplete="tel"      
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    id="addr-street"         
                    name="addressStreet"     
                    autoComplete="street-address" 
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="Street Address, Apartment, Suite"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <input
                  id="addr-city"           
                  name="addressCity"       
                  autoComplete="address-level2" 
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  id="addr-state"          
                  name="addressState"      
                  autoComplete="address-level1" 
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="State / Province"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  id="addr-zip"            
                  name="addressZip"        
                  autoComplete="postal-code" 
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                  placeholder="Postal / Zip Code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    id="addr-country"        
                    name="addressCountry"   
                    autoComplete="country-name" 
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    placeholder="Country"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleSaveAddress} 
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition shadow-lg hover:shadow-gray-400/20 flex items-center gap-2"
                >
                  <Save size={16} /> {editingIndex !== null ? "Update Address" : "Save Address"}
                </button>

                {editingIndex !== null && (
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setAddressForm(emptyAddress);
                    }}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;