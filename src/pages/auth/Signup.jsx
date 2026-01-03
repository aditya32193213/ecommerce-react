/**
 * =========================================================
 * File: Signup.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Register a new user account.
 *
 * Responsibilities:
 * - Capture user details
 * - Call backend register API
 * - Redirect user to login on success
 *
 * Notes:
 * - Uses controlled inputs with local state
 * =========================================================
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api"; // Use the centralized API instance
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  
  // Local state for form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    try {
      // Call Backend Register Endpoint
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // On success, redirect to Login
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      // Handle backend errors (e.g., "User already exists")
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-xl mb-4 shadow-lg shadow-green-200">
            <UserPlus size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2">Join us to start shopping seamlessly.</p>
        </div>
        
        {/* Form Fields */}
        <div className="space-y-5">
          
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="signup-name"
              name="name"
              autoComplete="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="signup-password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full mt-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          Sign Up <ArrowRight size={20} />
        </button>

        {/* Link to Login */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;