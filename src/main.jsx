/**
 * Main Entry Point
 * Renders the React app to the DOM with React Router configuration.
 * Defines all application routes including protected routes for authenticated-only pages.
 */

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Watch from "./pages/Watch.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile";
import Channel from "./pages/Channel.jsx";
import ProfileCustomize from "./pages/ProfileCustomize.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "watch/:id",
        element: <Watch />,
      },
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
      { path: "profile", element: <Profile /> },
      { path: "profile/customize", element: <ProfileCustomize /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
