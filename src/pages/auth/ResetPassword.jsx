/**
 * =========================================================
 * File: ResetPassword.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Allow users to reset their password using a token.
 *
 * Responsibilities:
 * - Validate password inputs
 * - Call backend reset-password API
 *
 * Notes:
 * - Token is received via route params
 * =========================================================
 */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import { Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error("Please fill all fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      // ✅ Adjust endpoint to match your backend (PUT or POST)
      await api.put(`/auth/reset-password/${token}`, { password });
      
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl mb-4 shadow-lg shadow-blue-200">
            <Lock size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Set New Password</h2>
          <p className="text-gray-500 mt-2">Your new password must be different from previously used passwords.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-gray-50/50 focus:bg-white"
            />
          </div>

          <button
            disabled={loading}
            className={`w-full mt-4 py-4 rounded-xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && <CheckCircle size={20} />}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;