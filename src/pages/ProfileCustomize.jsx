/**
 * Customize Profile Page - Light YouTube Studio Style
 * Allows users to update: banner image, avatar, username, and channel description.
 * This version ensures channelDescription is always included when updating profile info.
 */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function ProfileCustomize() {
  // JWT token used for authenticated requests
  const token = localStorage.getItem("token");

  // Holds full user profile (username, avatar, banner, description, etc.)
  const [user, setUser] = useState(null);

  // Toast notifications list
  const [toastList, setToastList] = useState([]);

  // File input references for triggering hidden input clicks
  const bannerRef = useRef(null);
  const avatarRef = useRef(null);

  // Preview + file states for local image previews
  const [bannerPreview, setBannerPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Navigation helper
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // Fetch user profile on mount
  // Ensures channelDescription always exists in the state object
  // ------------------------------------------------------------
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          ...res.data,
          channelDescription: res.data.channelDescription || "",
        });
      });
  }, []);

  // ------------------------------------------------------------
  // Handle Banner Upload to backend (Cloudinary)
  // ------------------------------------------------------------
  const handleBannerUpload = async () => {
    if (!bannerFile) return;

    const form = new FormData();
    form.append("banner", bannerFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/banner`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update UI instantly
    setUser((prev) => ({ ...prev, banner: data.user.banner }));

    // Persist new user info in local storage
    localStorage.setItem("user", JSON.stringify(data.user));

    // Show toast
    setToastList([
      ...toastList,
      { id: Date.now(), message: "Banner updated!", type: "success" },
    ]);
  };

  // ------------------------------------------------------------
  // Handle Avatar Upload to backend (Cloudinary)
  // ------------------------------------------------------------
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const form = new FormData();
    form.append("avatar", avatarFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/avatar`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update UI
    setUser((prev) => ({ ...prev, avatar: data.user.avatar }));

    // Save to local storage
    localStorage.setItem("user", JSON.stringify(data.user));

    // Show toast
    setToastList([
      ...toastList,
      { id: Date.now(), message: "Avatar updated!", type: "success" },
    ]);
  };

  // ------------------------------------------------------------
  // Save profile info (username + channel description)
  // Ensures channelDescription is ALWAYS included
  // ------------------------------------------------------------
  const saveInfo = async () => {
    const updates = {
      username: user.username,
      email: user.email, // kept intentionally, even if unchanged
      channelDescription: user.channelDescription || "",
    };

    const { data } = await axios.put(`${API_BASE_URL}/users/update`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Store updated user globally
    localStorage.setItem("user", JSON.stringify(data));

    // Success toast
    setToastList([
      ...toastList,
      { id: Date.now(), message: "Profile saved!", type: "success" },
    ]);

    // Small delay before redirect
    setTimeout(() => navigate("/profile"), 500);
  };

  // Show loading UI if user not fetched yet
  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black p-6 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Customize Channel</h1>

      {/* ---------------------------------------------
          BANNER SECTION
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Channel Banner</h2>

        {/* Banner Preview */}
        <img
          src={
            bannerPreview ||
            user.banner ||
            "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp"
          }
          className="w-full h-40 sm:h-52 md:h-64 object-cover rounded-lg border border-gray-200"
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={bannerRef}
          className="hidden"
          onChange={(e) => {
            setBannerFile(e.target.files[0]);
            setBannerPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <div className="mt-4 flex gap-3">
          {/* Trigger banner file picker */}
          <button
            onClick={() => bannerRef.current.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
          >
            Change Banner
          </button>

          {/* Upload updated banner */}
          {bannerFile && (
            <button
              onClick={handleBannerUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Banner
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------
          AVATAR SECTION
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Profile Picture</h2>

        <div className="flex items-center gap-5">
          {/* Avatar Preview */}
          <img
            src={avatarPreview || user.avatar}
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
          />

          <div>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={avatarRef}
              className="hidden"
              onChange={(e) => {
                setAvatarFile(e.target.files[0]);
                setAvatarPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />

            {/* Trigger Avatar Picker */}
            <button
              onClick={() => avatarRef.current.click()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg"
            >
              Change Avatar
            </button>

            {/* Upload Avatar */}
            {avatarFile && (
              <button
                onClick={handleAvatarUpload}
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Avatar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------
          BASIC INFORMATION SECTION
          Contains username + channel description
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-3">Basic Information</h2>

        <div className="space-y-4">
          {/* Username input */}
          <input
            className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={user.username}
            placeholder="Channel Name"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

          {/* Channel Description input */}
          <textarea
            className="w-full p-3 rounded-lg h-32 resize-none bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={user.channelDescription}
            placeholder="Write a description for your channel..."
            onChange={(e) =>
              setUser({ ...user, channelDescription: e.target.value })
            }
          ></textarea>
        </div>
      </div>

      {/* ---------------------------------------------
          SAVE BUTTON
      ---------------------------------------------- */}
      <button
        onClick={saveInfo}
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 shadow"
      >
        Save Changes
      </button>

      {/* ---------------------------------------------
          TOAST NOTIFICATIONS
      ---------------------------------------------- */}
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToastList(toastList.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </div>
  );
}
