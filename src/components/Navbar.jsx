import React, { useState } from "react";
import { Link } from "react-router-dom";
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

          {/* CENTER */}
          <div className="flex items-center w-[40%] max-w-xl">
            <div className="flex flex-1 border border-gray-300 rounded-l-full overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 outline-none"
              />
            </div>
            <button className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-r-full hover:bg-gray-200">
              <AiOutlineSearch size={20} />
            </button>

            <button className="ml-3 p-2 hover:bg-gray-200 rounded-full">
              <MdKeyboardVoice size={24} />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <MdVideoCall size={26} />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-200">
              <MdNotificationsNone size={26} />
            </button>

            <Link to="/register">
              <img
                src="https://i.pravatar.cc/264"
                alt="avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

function SidebarItem({ icon, text, to }) {
  return (
    <Link
      to={to || "#"}
      className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 cursor-pointer"
    >
      {icon}
      <span className="text-[15px]">{text}</span>
    </Link>
  );
}
