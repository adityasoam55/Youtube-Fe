/**
 * Register Page Component
 * Handles new user registration using username, email, password, and confirm password.
 * - Generates a random userId for each user.
 * - Assigns a default avatar based on username.
 * - Sends data to backend for account creation.
 * - On success, saves JWT + user info in localStorage and redirects home.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  // Form state for user input
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error message state
  const [error, setError] = useState("");

  /**
   * Handle input changes for all form fields
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle registration form submission
   * - Validates password match
   * - Builds registration payload
   * - Calls API to register user
   * - Stores token + user info in localStorage
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Payload for backend
    const userPayload = {
      userId: "user" + Math.floor(Math.random() * 9999), // Generate random ID
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar: `https://i.pravatar.cc/150?u=${formData.username}`, // Auto-generated avatar
    };

    try {
      // Send registration request
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userPayload
      );

      // Save token + user info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect and refresh UI
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center px-4 my-16">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        {/* ----------- Logo + Title ---------- */}
        <div className="text-center mb-6">
          <img
            src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
            alt="YouTube"
            className="h-12 mx-auto"
          />
          <h2 className="text-2xl font-semibold mt-2">Create your account</h2>
          <p className="text-gray-600 text-sm">Register to continue</p>
        </div>

        {/* ----------- Registration Form ---------- */}
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Username Input */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* ----------- Sign In Link ---------- */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
