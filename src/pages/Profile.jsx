/**
 * Profile Page Component
 * Displays and allows editing of user profile information (username, email).
 * Handles avatar upload to Cloudinary and user logout functionality.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Image uploaded successfully");
    } catch (err) {
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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="flex items-center gap-4">
        <img
          src={preview || user.avatar}
          className="w-24 h-24 rounded-full object-cover"
          alt="avatar"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setNewAvatar(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <button
          onClick={handleAvatarUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload Avatar
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <label>Username</label>
          <input
            className="w-full p-2 border rounded"
            value={user.username}
            onChange={(e) =>
              setUser((u) => ({ ...u, username: e.target.value }))
            }
          />
        </div>

        <div>
          <label>Email</label>
          <input
            className="w-full p-2 border rounded"
            value={user.email}
            onChange={(e) => setUser((u) => ({ ...u, email: e.target.value }))}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded ml-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
