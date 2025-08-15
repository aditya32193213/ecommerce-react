import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import background from "../assets/banner/loginpagebanner.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (form.username === "admin" && form.password === "password") {
      dispatch(login({ username: form.username }));
    } else {
      alert("Use Username- admin & password- password");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {!isAuthenticated ? (
        <div data-testid="login-form" className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            data-testid="username-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />
          <input
            data-testid="password-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
          />
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
          <button
            data-testid="login-button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="text-white text-center space-y-4">
          <h2 data-testid="welcome-message" className="text-3xl font-semibold">
            Welcome, {username}!
          </h2>
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
