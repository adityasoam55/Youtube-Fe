/**
 * Customize Profile Page
 * Allows editing avatar, banner, username, email.
 */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ProfileCustomize() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const bannerRef = useRef(null);
  const avatarRef = useRef(null);

  const [bannerPreview, setBannerPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data));
  }, []);

  const handleBannerUpload = async () => {
    if (!bannerFile) return;

    const form = new FormData();
    form.append("banner", bannerFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/banner`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Banner updated!");
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const form = new FormData();
    form.append("avatar", avatarFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/avatar`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Avatar updated!");
  };

  const saveInfo = async () => {
    const { data } = await axios.put(`${API_BASE_URL}/users/update`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("user", JSON.stringify(data));
    alert("Profile saved!");
    navigate("/profile");
  };

  if (!user)
    return <div className="text-center p-10 text-gray-300">Loading…</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Customize Channel</h1>

      {/* BANNER */}
      <div className="w-full mb-6">
        <img
          src={
            bannerPreview ||
            user.banner ||
            "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp"
          }
          className="w-full h-40 sm:h-52 object-cover rounded-lg border border-gray-700"
        />

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

        <button
          onClick={() => bannerRef.current.click()}
          className="mt-3 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Change Banner
        </button>

        {bannerFile && (
          <button
            onClick={handleBannerUpload}
            className="mt-3 ml-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Upload Banner
          </button>
        )}
      </div>

      {/* AVATAR */}
      <div className="flex items-center gap-5 mb-6">
        <img
          src={avatarPreview || user.avatar}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
        />

        <div>
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

          <button
            onClick={() => avatarRef.current.click()}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Change Avatar
          </button>

          {avatarFile && (
            <button
              onClick={handleAvatarUpload}
              className="ml-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Upload Avatar
            </button>
          )}
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="space-y-4">
        <input
          className="w-full p-3 rounded bg-[#1f1f1f] border border-gray-700"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />

        <input
          className="w-full p-3 rounded bg-[#1f1f1f] border border-gray-700"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>

      {/* SAVE */}
      <button
        onClick={saveInfo}
        className="mt-6 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
}
