/**
 * Protected Route Component
 * ------------------------------------------------------------------
 * A wrapper component used to protect private routes.
 *
 * Behavior:
 *  - Checks for a valid JWT token stored in localStorage.
 *  - If NO token exists → user is redirected to the login page.
 *  - If token exists → renders the children components normally.
 *
 * Usage:
 *  <ProtectedRoute>
 *      <Upload />
 *  </ProtectedRoute>
 *
 * This ensures only authenticated users can access specific pages.
 */

import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Read JWT token from localStorage to check authentication state
  const token = localStorage.getItem("token");

  // If token is missing → redirect user to login page
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated → allow access to protected component
  return children;
}
