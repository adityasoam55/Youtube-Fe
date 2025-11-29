import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdKeyboardVoice,
  MdNotificationsNone,
  MdVideoCall,
} from "react-icons/md";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
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

        {/* CENTER (search bar) */}
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

          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/264"
            alt="avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
