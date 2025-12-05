/**
 * ===============================================================
 * Public Profile Page (YouTube-Style)
 * ---------------------------------------------------------------
 * This page displays the user's public channel information:
 *  - Banner Image
 *  - Avatar / Profile Picture
 *  - Channel Name + Handle (@username)
 *  - Channel Description (read-only)
 *  - Buttons: Customize Channel, Manage Videos, Logout
 *
 * Data:
 *  - Fetches authenticated user via GET /users/me
 *
 * Notes:
 *  - This is the *public view* of their channel, not the studio.
 *  - Customization happens on /profile/customize
 * ===============================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Loading from "../components/Loading";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* ------------------------------------------------------------
   * Fetch logged-in user's profile
   * ------------------------------------------------------------ */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.log("Failed to fetch profile:", err);
      }
    };

    fetchUser();
  }, []);

  /* ------------------------------------------------------------
   * Logout User
   * - Clears token + user from localStorage
   * - Dispatches an event so Navbar updates immediately
   * - Redirects to homepage
   * ------------------------------------------------------------ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
      window.dispatchEvent(new Event("authChanged"));
    } catch (e) {}

    navigate("/");
  };

  // Show loader while profile is being fetched
  if (!user) return <Loading message="Loading profile..." />;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* ==========================================================
           CHANNEL BANNER
         ========================================================== */}
      <div className="w-full h-40 sm:h-52 md:h-64 bg-gray-700 relative">
        <img
          src={
            user.banner ||
            "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp"
          }
          alt="banner"
          className="w-full h-full object-cover"
        />

        {/* Avatar positioned overlapping banner */}
        <div className="absolute -bottom-16 left-6 flex items-center">
          <img
            src={user.avatar}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#0f0f0f] shadow-xl"
          />
        </div>
      </div>

      {/* ==========================================================
           CHANNEL INFO SECTION
         ========================================================== */}
      <div className="px-6 sm:px-10 mt-20">
        {/* Channel Name */}
        <h1 className="text-3xl font-bold">{user.username}</h1>

        {/* Auto-generated handle (YouTube style) */}
        <p className="text-gray-400 mt-1">
          @{user.username.replace(/\s/g, "")}
        </p>

        {/* ========================================================
             CHANNEL DESCRIPTION
           ======================================================== */}
        <div className="w-full mt-2 text-sm text-gray-500">
          <h3 className="font-medium mb-1">Channel description</h3>

          <p className="text-sm text-gray-400">
            {user.channelDescription
              ? user.channelDescription
              : "No description yet. Customize your channel to add one."}
          </p>
        </div>

        {/* ========================================================
             ACTION BUTTONS
           ======================================================== */}
        <div className="flex gap-3 mt-5 flex-wrap">
          {/* Customize channel settings */}
          <Link to="/profile/customize">
            <button className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-200">
              Customise Channel
            </button>
          </Link>

          {/* Manage uploaded videos */}
          <Link to="/channel">
            <button className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-200">
              Manage Videos
            </button>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
