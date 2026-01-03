/**
 * =========================================================
 * File: ForgotPassword.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Allow users to request a password reset link.
 *
 * Responsibilities:
 * - Capture email input
 * - Call backend forgot-password API
 *
 * Notes:
 * - Displays confirmation once email is sent
 * =========================================================
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      // ✅ Adjust endpoint to match your backend
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center">
        
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-xl mb-6 shadow-lg shadow-amber-50">
          <KeyRound size={24} />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-500 mb-8">
          No worries! Enter your email and we'll send you reset instructions.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative text-left">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="forgot-email"       // ✅ Added ID
                name="email"            // ✅ Added Name
                autoComplete="email"    // ✅ Added AutoComplete
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gray-900 hover:bg-amber-600 hover:shadow-amber-500/30"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 mb-6 animate-fade-in">
            <p className="font-medium">Check your inbox!</p>
            <p className="text-sm mt-1">We've sent a link to <b>{email}</b></p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link to="/login" className="flex items-center justify-center gap-2 text-gray-600 font-bold hover:text-gray-900 transition">
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;