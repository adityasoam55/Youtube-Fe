/**
 * Loading Component
 * Reusable loading spinner with animated dots and branding.
 * Matches the application UI theme with Tailwind styling.
 */

import React from "react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>

            {/* Inner rotating ring (slower) */}
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            ></div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="text-lg font-semibold text-gray-800 tracking-wide">
          <span>{message}</span>
          <span className="inline-block ml-1">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
              .
            </span>
            <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
              .
            </span>
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mt-4">Please wait</p>
      </div>
    </div>
  );
}
