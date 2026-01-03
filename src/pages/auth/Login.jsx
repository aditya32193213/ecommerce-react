/**
 * =========================================================
 * File: Login.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Authenticate users into the application.
 *
 * Responsibilities:
 * - Handle login form submission
 * - Store auth state in Redux
 * - Redirect users based on role
 *
 * Notes:
 * - Shows alternate UI when user is already logged in
 * =========================================================
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import { Mail, Lock, LogIn, ArrowRight, User, LogOut } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username, isAdmin } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async () => {
  if (!form.email || !form.password) {
    return toast.error("Please enter email and password");
  }

  try {
    const res = await api.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    dispatch(
      login({
        username: res.data.user.name,
        token: res.data.token,
        isAdmin: res.data.user.isAdmin,
      })
    );

    toast.success("Login Successful!");

    // ✅ ROLE-BASED REDIRECT
    if (res.data.user.isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid credentials");
  }
};


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // --- Already Authenticated View ---
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-500 mb-8 text-lg">
            You are currently logged in as <span className="font-semibold text-gray-900">{username}</span>.
          </p>
          
          <div className="grid gap-3">
            <button 
              onClick={() =>navigate(isAdmin ? "/admin/dashboard" : "/dashboard")} 
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleLogout} 
              className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Login Form View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4" >
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl mb-4 shadow-lg shadow-blue-200">
            <LogIn size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
        </div>
        
        {/* Form Fields */}
        <div className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mt-2 mb-6">
        {/* ✅ UPDATE: Changed to="/forgot-password" */}
        <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
        Forgot Password?
        </Link>
        </div>
        {/* Submit Button */}
        <button 
          onClick={handleLogin} 
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          Sign In
        </button>

        {/* Signup Link */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;