
/**
 * =========================================================
 * File: api.js
 * ---------------------------------------------------------
 * Purpose:
 * - Centralized Axios configuration for all API requests.
 *
 * Responsibilities:
 * - Define backend base URL
 * - Attach JWT token automatically to every request
 * - Handle global authentication failures (401)
 *
 * Notes:
 * - Uses Axios interceptors
 * - Redirects to /login on token expiry or unauthorized access
 * =========================================================
 */

import axios from "axios";

// Backend base URL
const API_BASE = process.env.REACT_APP_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach token automatically if present
api.interceptors.request.use(
  (config) => {
    const savedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (savedAuth.token) {
      config.headers.Authorization = `Bearer ${savedAuth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔐 GLOBAL 401 HANDLER
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
