/**
 * ===============================================================
 * Login Page Component
 * ---------------------------------------------------------------
 * This component handles:
 *  - User authentication using email + password
 *  - Sending credentials to backend via POST /auth/login
 *  - Saving JWT token + User object in localStorage
 *  - Redirecting user to Home and refreshing Navbar state
 *
 * UI:
 *  - Clean, YouTube-inspired login card
 *  - Form validation + error handling
 * ===============================================================
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Login() {
  const navigate = useNavigate();

  // Form state for email + password
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Error state for authentication issues
  const [error, setError] = useState("");

  /* ------------------------------------------------------------
   * Handle input changes for controlled form fields
   * ------------------------------------------------------------ */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ------------------------------------------------------------
   * Submit Login Form
   * Sends credentials to backend and retrieves:
   *   - JWT token
   *   - User object
   * Saves both in localStorage and redirects to homepage.
   * ------------------------------------------------------------ */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      // Store authentication details locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate home and refresh Navbar immediately
      navigate("/");
      window.location.reload();
    } catch (err) {
      // Friendly error message
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        {/* ------------------ Logo + Header ------------------ */}
        <div className="text-center mb-6">
          <img
            src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
            alt="YouTube"
            className="h-12 mx-auto"
          />
          <h2 className="text-2xl font-semibold mt-2">Sign in</h2>
          <p className="text-gray-600 text-sm">Use your account</p>
        </div>

        {/* ------------------ Login Form ------------------ */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full p-3 border rounded-lg mt-1 outline-none 
              focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg mt-1 outline-none 
              focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg 
            hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* ------------------ Footer Link ------------------ */}
        <p className="mt-4 text-center text-sm">
          Don't have an account?
          <Link to="/register" className="text-blue-600 font-medium ml-1">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
