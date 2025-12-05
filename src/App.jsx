/**
 * ===========================================================
 * App Component (Root Layout)
 * -----------------------------------------------------------
 * This component is the main layout of the application.
 * It renders the global Navbar and an <Outlet /> where all
 * nested routes (Home, Watch, Profile, etc.) will be displayed.
 *
 * React Router:
 * - <Navbar /> stays persistent on every page.
 * - <Outlet /> dynamically loads each route's component.
 *
 * This structure keeps the layout consistent across pages,
 * similar to YouTube's persistent top navigation bar.
 * ===========================================================
 */

import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Global Navigation Bar (Always Visible) */}
      <Navbar />

      {/* Page Content Loaded by React Router */}
      <Outlet />
    </div>
  );
}

export default App;
