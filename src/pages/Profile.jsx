/**
 * Profile Page Component
 * Displays and allows editing of user profile information (username, email).
 * Handles avatar upload to Cloudinary and user logout functionality.
 */

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarUpload = async () => {
    if (!newAvatar) return;

    const form = new FormData();
    form.append("avatar", newAvatar);

    try {
      const { data } = await axios.put(`${API_BASE_URL}/users/avatar`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let axios automatically set multipart/form-data with boundary
        },
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setNewAvatar(null);
      setPreview("");
      alert("Image uploaded successfully");
    } catch (err) {
      console.error("Avatar upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Image upload failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/users/update`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      // redirect to home after save
      navigate("/");
      // refresh UI (navbar) to reflect saved changes
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="flex flex-col md:flex-row items-start md:items-stretch gap-6">
        {/* Avatar / Upload column */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-4">
          <img
            src={preview || user.avatar}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow"
            alt="avatar"
          />

          <div className="w-full flex flex-col items-center md:items-start gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewAvatar(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <span className="text-xs">Maximum file size 10MB</span>
            <button
              type="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="w-full md:w-auto px-4 py-2 bg-gray-100 border rounded text-sm hover:bg-gray-200"
            >
              Choose Image
            </button>
          </div>

          <button
            onClick={handleAvatarUpload}
            disabled={!newAvatar}
            className={`w-full md:w-auto mt-1 px-4 py-2 rounded text-white ${
              newAvatar
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Upload Avatar
          </button>
        </div>

        {/* Details column */}
        <div className="w-full md:w-2/3">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.username}
                onChange={(e) =>
                  setUser((u) => ({ ...u, username: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.email}
                onChange={(e) =>
                  setUser((u) => ({ ...u, email: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
