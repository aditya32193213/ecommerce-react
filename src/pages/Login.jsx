/**
 * File: Login.jsx
 * Description: Handles user authentication (login/logout) for the app.
 * Purpose:
 *   - Provides a login form for users.
 *   - Dispatches Redux `login` and `logout` actions.
 *   - Persists authentication state in Redux and localStorage (via authSlice).
 *   - Navigates users to the Dashboard on successful login.
 *
 * Features:
 *   - Username & password input fields.
 *   - "Remember me" checkbox (UI only).
 *   - Conditional rendering (login form if logged out, welcome screen if logged in).
 *   - Auto-redirect to dashboard if already logged in.
 *   - Logout button to clear session and return to login page.
 *
 * Authentication:
 *   - Hardcoded credentials: Username = `admin`, Password = `password`.
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state & actions
import { login, logout } from "../redux/slices/authSlice"; // Auth slice actions
import { useNavigate } from "react-router-dom"; // Navigation
import background from "../assets/banner/loginpagebanner.jpg"; // Background image for login page

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Pull auth state from Redux store
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  //  Local state for form inputs
  const [form, setForm] = useState({ username: "", password: "" });

  //  Local state for "Remember Me" checkbox
  const [remember, setRemember] = useState(false);

  // Handle input field changes (username & password)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login logic
  const handleLogin = () => {
    //  Hardcoded check for demo authentication
    if (form.username === "admin" && form.password === "password") {
      dispatch(login({ username: form.username })); // Dispatch login action
      navigate("/dashboard"); // Redirect to dashboard after login
    } else {
      alert("Use Username- admin & password- password"); // Invalid credentials
    }
  };

  // Handle logout logic
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/login"); // Redirect back to login
  };

  //  Automatically redirect logged-in users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* If NOT authenticated, show login form */}
      {!isAuthenticated ? (
        <div
          data-testid="login-form"
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <h2 className="text-2xl mb-4">Login</h2>

          {/* Username input */}
          <input
            data-testid="username-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />

          {/* Password input */}
          <input
            data-testid="password-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />

          {/* Remember Me checkbox */}
          <div className="mb-3">
            <label className="flex items-center space-x-2">
              <input
                data-testid="remember-me-checkbox"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login button */}
          <button
            data-testid="login-button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      ) : (
        // If authenticated, show welcome screen with logout
        <div className="text-white text-center space-y-4">
          <h2
            data-testid="welcome-message"
            className="text-3xl font-semibold"
          >
            Welcome, {username}!
          </h2>

          {/* Logout button */}
          <button
            data-testid="logout-button"
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
