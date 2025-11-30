import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userPayload = {
      userId: "user" + Math.floor(Math.random() * 9999), // random ID
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar: `https://i.pravatar.cc/150?u=${formData.username}`
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      // Save token + user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/"); // redirect home
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center px-4 my-16">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
            alt="YouTube"
            className="h-12 mx-auto"
          />
          <h2 className="text-2xl font-semibold mt-2">Create your account</h2>
          <p className="text-gray-600 text-sm">Register to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Username */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* Already have account */}
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
