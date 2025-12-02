import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);
  }, []);

  const handleAvatarUpload = async () => {
    if (!newAvatar) return;

    const form = new FormData();
    form.append("avatar", newAvatar);

    const res = await fetch("http://localhost:5000/api/users/avatar", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    // show confirmation popup
    try {
      if (res.ok) alert("Image uploaded successfully");
      else alert(data.message || "Image upload failed");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async () => {
    const res = await fetch("http://localhost:5000/api/users/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const updated = await res.json();
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    // redirect to home after save
    navigate("/");
    // refresh UI (navbar) to reflect saved changes
    window.location.reload();
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
