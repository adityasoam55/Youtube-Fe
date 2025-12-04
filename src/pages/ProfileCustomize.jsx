/**
 * Customize Profile Page - Light YouTube Studio Style
 * Updated so channelDescription is ALWAYS saved correctly.
 */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function ProfileCustomize() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [toastList, setToastList] = useState([]);

  const bannerRef = useRef(null);
  const avatarRef = useRef(null);

  const [bannerPreview, setBannerPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();

  // ---------------------------------------------
  // Fetch user profile
  // ---------------------------------------------
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Ensure description field always exists in state
        setUser({
          ...res.data,
          channelDescription: res.data.channelDescription || "",
        });
      });
  }, []);

  // ---------------------------------------------
  // Upload banner
  // ---------------------------------------------
  const handleBannerUpload = async () => {
    if (!bannerFile) return;

    const form = new FormData();
    form.append("banner", bannerFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/banner`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser((prev) => ({ ...prev, banner: data.user.banner }));
    localStorage.setItem("user", JSON.stringify(data.user));
    setToastList([
      ...toastList,
      { id: Date.now(), message: "Banner updated!", type: "success" },
    ]);
  };

  // ---------------------------------------------
  // Upload avatar
  // ---------------------------------------------
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const form = new FormData();
    form.append("avatar", avatarFile);

    const { data } = await axios.put(`${API_BASE_URL}/users/avatar`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser((prev) => ({ ...prev, avatar: data.user.avatar }));
    localStorage.setItem("user", JSON.stringify(data.user));
    setToastList([
      ...toastList,
      { id: Date.now(), message: "Avatar updated!", type: "success" },
    ]);
  };

  // ---------------------------------------------
  // Save profile info (THIS IS WHERE WE FIXED THE BUG)
  // ---------------------------------------------
  const saveInfo = async () => {
    const updates = {
      username: user.username,
      email: user.email, // kept as is
      channelDescription: user.channelDescription || "", // ensure always sent
    };

    const { data } = await axios.put(`${API_BASE_URL}/users/update`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Save updated user locally
    console.log(data);
    localStorage.setItem("user", JSON.stringify(data));

    setToastList([
      ...toastList,
      { id: Date.now(), message: "Profile saved!", type: "success" },
    ]);
    setTimeout(() => navigate("/profile"), 500);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black p-6 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Customize Channel</h1>

      {/* ---------------------------------------------
          BANNER
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Channel Banner</h2>

        <img
          src={
            bannerPreview ||
            user.banner ||
            "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp"
          }
          className="w-full h-40 sm:h-52 md:h-64 object-cover rounded-lg border border-gray-200"
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

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => bannerRef.current.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
          >
            Change Banner
          </button>

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
          AVATAR
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Profile Picture</h2>

        <div className="flex items-center gap-5">
          <img
            src={avatarPreview || user.avatar}
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
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
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg"
            >
              Change Avatar
            </button>

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
          BASIC INFORMATION (Username + Description)
      ---------------------------------------------- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-3">Basic Information</h2>

        <div className="space-y-4">
          {/* Username */}
          <input
            className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={user.username}
            placeholder="Channel Name"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

          {/* Channel Description */}
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

      {/* SAVE BUTTON */}
      <button
        onClick={saveInfo}
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 shadow"
      >
        Save Changes
      </button>

      {/* Toast Notifications */}
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
