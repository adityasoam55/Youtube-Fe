/**
 * Navbar Component
 * ------------------------------------------------------------------
 * Main top navigation bar of the application.
 *
 * Features:
 *  - Sidebar toggle for mobile/desktop navigation
 *  - Search box (desktop) + mobile search overlay
 *  - Auth-aware UI (Login button OR Upload, Notifications, Channel, Profile)
 *  - Automatically updates when user logs in/out using localStorage events
 *
 * Interactions:
 *  - Search triggers Home page filtering via URL query param `?search=`
 *  - Sidebar items navigate using React Router links
 *  - Avatar shows current logged-in user
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegCompass } from "react-icons/fa";
import {
  MdKeyboardVoice,
  MdNotificationsNone,
  MdVideoCall,
} from "react-icons/md";

export default function Navbar() {
  // Sidebar open state
  const [open, setOpen] = useState(false);

  // Mobile search bar state + ref for auto-focus
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Local state for search box value (syncs with URL)
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  /**
   * Sync searchTerm whenever URL changes
   */
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  /**
   * Trigger search on ENTER key
   */
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  /**
   * Auto-focus the mobile search input when overlay opens
   */
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Current logged-in user state
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  /**
   * Listen for login/logout updates (same-tab + multi-tab support)
   * - "authChanged" → custom event dispatched manually on login/logout
   * - "storage" → multi-tab sync for authentication updates
   */
  useEffect(() => {
    const onAuthChange = () => {
      const s = localStorage.getItem("user");
      setCurrentUser(s ? JSON.parse(s) : null);
    };

    window.addEventListener("authChanged", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      window.removeEventListener("authChanged", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  return (
    <>
      {/* ------------------------------------------
          SCREEN BACKDROP (when sidebar is open)
      ------------------------------------------- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* ------------------------------------------
          SIDE MENU DRAWER
      ------------------------------------------- */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header with Close Button + Logo */}
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={() => setOpen(false)}
          >
            <HiOutlineX size={24} />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
              alt="YouTube"
              className="h-10"
            />
          </Link>
        </div>

        {/* Sidebar Navigation Items */}
        <ul className="mt-2">
          <SidebarItem
            icon={<AiOutlineHome size={22} />}
            text="Home"
            to="/"
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            icon={<FaRegCompass size={20} />}
            text="Explore"
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions size={22} />}
            text="Subscriptions"
            onClick={() => setOpen(false)}
          />

          <hr className="my-3" />

          <SidebarItem
            icon={<MdOutlineVideoLibrary size={22} />}
            text="Library"
            onClick={() => setOpen(false)}
          />
        </ul>
      </div>

      {/* ------------------------------------------
          TOP NAVBAR
      ------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* LEFT SECTION (Sidebar Toggle + Logo) */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setOpen(true)}
            >
              <HiOutlineMenu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
                alt="YouTube"
                className="h-10"
              />
            </Link>
          </div>

          {/* CENTER SEARCH (Desktop Only) */}
          <div className="hidden md:flex items-center w-[40%] max-w-xl">
            {/* Input Field */}
            <div className="flex flex-1 border border-gray-300 rounded-l-full bg-white overflow-hidden">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-r-full hover:bg-gray-200"
              onClick={() =>
                navigate(`/?search=${encodeURIComponent(searchTerm)}`)
              }
            >
              <AiOutlineSearch size={20} />
            </button>

            {/* Voice Search Icon */}
            <button className="ml-3 p-2 hover:bg-gray-200 rounded-full">
              <MdKeyboardVoice size={24} />
            </button>
          </div>

          {/* MOBILE SEARCH ICON */}
          <div className="flex md:hidden items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setMobileSearchOpen(true)}
            >
              <AiOutlineSearch size={20} />
            </button>
          </div>

          {/* RIGHT SECTION – Auth Controls */}
          <div className="flex items-center gap-3">
            {/* If NOT logged in → show Login button */}
            {!currentUser && (
              <Link
                to="/login"
                className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50"
              >
                Login
              </Link>
            )}

            {/* If logged in → show upload, notifications, channel, avatar */}
            {currentUser && (
              <>
                {/* Upload Video */}
                <Link to="/upload">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Upload"
                  >
                    <MdVideoCall size={26} />
                  </button>
                </Link>

                {/* Notifications */}
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <MdNotificationsNone size={26} />
                </button>

                {/* Channel Videos */}
                <Link to="/">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="My Channel"
                  >
                    <MdOutlineVideoLibrary size={26} />
                  </button>
                </Link>

                {/* User Avatar */}
                <Link to="/channel">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={currentUser?.avatar || "https://i.pravatar.cc/100"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="hidden sm:inline font-medium">
                      {currentUser.username}
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------
          MOBILE SEARCH OVERLAY
      ------------------------------------------- */}
      {mobileSearchOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-3 py-2 flex items-center gap-2">
          {/* Close Search */}
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMobileSearchOpen(false)}
          >
            <HiOutlineX size={22} />
          </button>

          {/* Search Input */}
          <input
            ref={mobileSearchRef}
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?search=${encodeURIComponent(searchTerm)}`);
                setMobileSearchOpen(false);
              }
            }}
          />
        </div>
      )}
    </>
  );
}

/**
 * SidebarItem Component
 * Renders an icon + text item inside the sidebar menu.
 */
function SidebarItem({ icon, text, to, onClick }) {
  return (
    <Link
      to={to || "#"}
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 cursor-pointer"
    >
      {icon}
      <span className="text-[15px]">{text}</span>
    </Link>
  );
}
