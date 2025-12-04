import React, { useState, useEffect } from "react";

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 ${typeStyles[type]} animate-fade-in z-50 max-w-sm text-sm md:text-base`}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 hover:opacity-80 font-bold"
      >
        ✕
      </button>
    </div>
  );
}
