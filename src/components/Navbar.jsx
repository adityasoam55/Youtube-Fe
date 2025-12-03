/**
 * Navbar Component
 * Main navigation bar with search functionality, user profile display, and sidebar toggle.
 * Displays login link for unauthenticated users and profile avatar + upload/notification buttons for logged-in users.
 * Search input uses React Router's useSearchParams to update URL query parameters for filtering on the Home page.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegCompass } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdKeyboardVoice,
  MdNotificationsNone,
  MdVideoCall,
} from "react-icons/md";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // keep input synced when URL search param changes
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // NEW: User state
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={() => setOpen(false)}
          >
            {open ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>

          <Link to="/" className="flex items-center">
            <img
              src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
              alt="YouTube"
              className="h-10"
            />
          </Link>
        </div>

        {/* MENU LIST */}
        <ul className="mt-2">
          <SidebarItem icon={<AiOutlineHome size={22} />} text="Home" to="/" />
          <SidebarItem icon={<FaRegCompass size={20} />} text="Explore" />
          <SidebarItem
            icon={<MdOutlineSubscriptions size={22} />}
            text="Subscriptions"
          />

          <hr className="my-3" />

          <SidebarItem
            icon={<MdOutlineVideoLibrary size={22} />}
            text="Library"
          />
        </ul>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setOpen(true)}
            >
              <HiOutlineMenu size={24} />
            </button>

            <Link to="/" className="flex items-center">
              <img
                src="https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg"
                alt="YouTube"
                className="h-10"
              />
            </Link>
          </div>

          {/* CENTER - desktop only */}
          <div className="hidden md:flex items-center w-[40%] max-w-xl">
            <div className="flex flex-1 border border-gray-300 rounded-l-full overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 outline-none"
              />
            </div>
            <button
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-r-full hover:bg-gray-200"
              onClick={() =>
                navigate(`/?search=${encodeURIComponent(searchTerm)}`)
              }
            >
              <AiOutlineSearch size={20} />
            </button>

            <button className="ml-3 p-2 hover:bg-gray-200 rounded-full">
              <MdKeyboardVoice size={24} />
            </button>
          </div>

          {/* CENTER - mobile: show search icon */}
          <div className="flex md:hidden items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <AiOutlineSearch size={20} />
            </button>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {/* NOT LOGGED IN → Show Sign In */}
            {!currentUser && (
              <Link
                to="/login"
                className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50"
              >
                Login
              </Link>
            )}

            {/* LOGGED IN → Show icons + username + avatar */}
            {currentUser && (
              <>
                <Link to="/upload">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Upload"
                  >
                    <MdVideoCall size={26} />
                  </button>
                </Link>

                <button className="p-2 rounded-full hover:bg-gray-200">
                  <MdNotificationsNone size={26} />
                </button>

                <Link to="/channel">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="My Channel"
                  >
                    <MdOutlineVideoLibrary size={26} />
                  </button>
                </Link>

                <Link to="/profile">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
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

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-3 py-2 flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
          >
            <HiOutlineX size={22} />
          </button>
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
