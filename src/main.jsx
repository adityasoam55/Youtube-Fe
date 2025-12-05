/**
 * ============================================================
 * Main Entry Point
 * ============================================================
 * - Initializes the React application
 * - Configures all client-side routes using React Router
 * - Wraps protected pages with <ProtectedRoute>
 * - Renders <App /> as the root layout component
 */

import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages & Components
import Home from "./components/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Watch from "./pages/Watch.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import Channel from "./pages/Channel.jsx";
import ProfileCustomize from "./pages/ProfileCustomize.jsx";

/**
 * ------------------------------------------------------------
 * Route Configuration
 * ------------------------------------------------------------
 * Root Layout: <App />
 * Children routes:
 *   - Public: Home, Register, Login, Watch, Profile
 *   - Protected: Upload, Channel, ProfileCustomize
 * ------------------------------------------------------------
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Shared layout + navbar
    children: [
      { path: "/", element: <Home /> },

      // Authentication
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },

      // Public Watch Page
      { path: "watch/:id", element: <Watch /> },

      // Protected Routes
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        ),
      },
      {
        path: "channel",
        element: (
          <ProtectedRoute>
            <Channel />
          </ProtectedRoute>
        ),
      },

      // Profile Pages (redirect to unified channel page)
      { path: "profile", element: <Navigate to="/channel" replace /> },
      { path: "profile/customize", element: <ProfileCustomize /> },
    ],
  },
]);

/**
 * Render the application to the DOM
 * using React 18's createRoot API.
 */
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
