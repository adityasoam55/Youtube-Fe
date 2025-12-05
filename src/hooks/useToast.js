/**
 * Custom Toast Hook
 * ------------------
 * Manages toast notifications globally across the app.
 *
 * Features:
 * - Add toast messages (success, error, warning, info)
 * - Auto-remove toast after given duration
 * - Exposes helper methods for easy usage in components
 */

import { useState, useCallback } from "react";

export default function useToast() {
  // Stores list of active toast notifications
  const [toasts, setToasts] = useState([]);

  /**
   * showToast()
   * -----------
   * Main function to display a toast.
   * Creates a unique ID, adds toast to the list,
   * and auto-removes it after duration.
   */
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now(); // unique timestamp ID

    // Add new toast to state
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Remove toast after given duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  /**
   * Type-specific helper functions
   * Reuse showToast with type pre-filled.
   */
  const success = useCallback(
    (message, duration) => showToast(message, "success", duration),
    [showToast]
  );

  const error = useCallback(
    (message, duration) => showToast(message, "error", duration),
    [showToast]
  );

  const warning = useCallback(
    (message, duration) => showToast(message, "warning", duration),
    [showToast]
  );

  const info = useCallback(
    (message, duration) => showToast(message, "info", duration),
    [showToast]
  );

  // Return API for components to use
  return {
    showToast,
    success,
    error,
    warning,
    info,
    toasts,
  };
}
