/**
 * App Component (Root Layout)
 * Main application wrapper that renders the Navbar and Outlet for nested routes.
 * Uses React Router to handle page navigation throughout the app.
 */

import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
