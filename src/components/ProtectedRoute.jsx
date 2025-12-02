/**
 * Protected Route Component
 * Higher-order component that wraps routes requiring authentication.
 * Redirects to login page if JWT token is not found in localStorage.
 */

import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
