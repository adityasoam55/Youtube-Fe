/**
 * Toast Component
 * ------------------------------------------------------------
 * A lightweight notification component that displays temporary
 * messages such as success, error, warning, or info.
 *
 * Automatically hides after a given duration and supports manual close.
 */

import React, { useState, useEffect } from "react";

export default function Toast({
  message, // Text message to display inside the toast
  type = "info", // Type of toast → determines color & icon
  duration = 3000, // How long the toast stays visible (ms)
  onClose, // Optional callback when toast closes
}) {
  const [isVisible, setIsVisible] = useState(true); // Controls visibility animation

  /**
   * Auto-hide logic:
   * After `duration` ms, the toast fades out and triggers onClose().
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(); // Notify parent component when closing
    }, duration);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // If toast is no longer visible, remove it from DOM
  if (!isVisible) return null;

  /**
   * Theme-based Tailwind color classes for each toast type.
   */
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  /**
   * Icon shown based on message type.
   */
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg 
        flex items-center gap-3 
        ${typeStyles[type]}  /* Apply style based on type */
        animate-fade-in        /* Fade-in animation */
        z-50 max-w-sm text-sm md:text-base
      `}
    >
      {/* Left Icon */}
      <span className="text-lg font-bold">{icons[type]}</span>

      {/* Message Text */}
      <span className="flex-1">{message}</span>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)} // Manual dismiss
        className="ml-2 hover:opacity-80 font-bold"
      >
        ✕
      </button>
    </div>
  );
}
