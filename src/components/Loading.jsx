/**
 * Loading Component
 * ------------------
 * A reusable full-screen loading UI that displays:
 *  - A dual rotating spinner animation
 *  - A customizable loading message with animated dots
 *  - A subtle subtitle ("Please wait")
 *
 * This component is used across pages where API calls or page transitions
 * require the user to wait briefly. Styled with Tailwind CSS to match
 * the modern, clean theme used throughout the project.
 */

import React from "react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* -----------------------------
            SPINNER ANIMATION
            Two layered rings rotating in opposite directions
        ------------------------------ */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>

            {/* Inner rotating ring (slower & reverse direction) */}
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "2s",
              }}
            ></div>
          </div>
        </div>

        {/* -----------------------------
            LOADING MESSAGE
            Text with pulsing dots animation for visual feedback
        ------------------------------ */}
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

        {/* Subtext for additional clarity */}
        <p className="text-sm text-gray-500 mt-4">Please wait</p>
      </div>
    </div>
  );
}
