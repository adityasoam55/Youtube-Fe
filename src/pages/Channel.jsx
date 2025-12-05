/**
 * ===============================================================
 * Channel Management Page
 * ---------------------------------------------------------------
 * This page allows an authenticated user to:
 *  - View all videos they have uploaded
 *  - Edit video metadata (title, description, category)
 *  - Delete videos they own
 *  - Navigate to upload new videos
 *
 * Includes:
 *  - CRUD operations for videos
 *  - Local state management for edit mode
 *  - Toast notifications
 *  - Redirect protection for unauthenticated access
 * ===============================================================
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function Channel() {
  const navigate = useNavigate();

  // Auth values
  const token = localStorage.getItem("token");
  // Keep user in state so we can refresh it from server (shows latest banner/description)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // State: videos uploaded by the channel owner
  const [videos, setVideos] = useState([]);

  // State: loading skeleton while fetching videos
  const [loading, setLoading] = useState(true);

  // State: which video is currently being edited
  const [editingVideoId, setEditingVideoId] = useState(null);

  // State: edit form fields
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "Frontend",
  });

  // State: toast notifications
  const [toastList, setToastList] = useState([]);
  // UI state: description expanded + active tab
  const [descOpen, setDescOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");

  /* ------------------------------------------------------------
   * Redirect user to login page if not authenticated
   * Only check token here; user will be fetched if token exists.
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* ------------------------------------------------------------
   * Fetch current user from backend to ensure we show latest banner/description
   * ------------------------------------------------------------ */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        try {
          localStorage.setItem("user", JSON.stringify(data));
        } catch (e) {}
      } catch (err) {
        console.log("Failed to fetch current user:", err);
      }
    };

    fetchUser();
  }, [token]);

  /* ------------------------------------------------------------
   * Fetch all videos owned by the logged-in user (channel owner)
   * ------------------------------------------------------------ */
  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${API_BASE_URL}/videos/channel/my-videos`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVideos(data);
      } catch (err) {
        console.error("❌ Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchChannelVideos();
  }, [token]);

  /* ------------------------------------------------------------
   * Enter edit mode for a specific video
   * ------------------------------------------------------------ */
  const startEditing = (video) => {
    setEditingVideoId(video.videoId);

    // Pre-fill the form with existing values
    setEditForm({
      title: video.title,
      description: video.description || "",
      category: video.category,
    });
  };

  /* ------------------------------------------------------------
   * Cancel edit mode and reset form
   * ------------------------------------------------------------ */
  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditForm({ title: "", description: "", category: "Frontend" });
  };

  /* ------------------------------------------------------------
   * Update video metadata (title, description, category)
   * Calls backend PUT /videos/channel/:videoId
   * ------------------------------------------------------------ */
  const handleUpdateVideo = async (videoId) => {
    if (!editForm.title.trim()) {
      setToastList([
        ...toastList,
        { id: Date.now(), message: "Title cannot be empty", type: "warning" },
      ]);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/videos/channel/${videoId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI instantly without refetch
      setVideos(
        videos.map((v) => (v.videoId === videoId ? { ...v, ...editForm } : v))
      );

      setToastList([
        ...toastList,
        { id: Date.now(), message: "Video updated!", type: "success" },
      ]);

      cancelEditing();
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Failed to update video",
          type: "error",
        },
      ]);
    }
  };

  /* ------------------------------------------------------------
   * Delete video permanently
   * Calls backend DELETE /videos/channel/:videoId
   * ------------------------------------------------------------ */
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/videos/channel/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted video from state
      setVideos(videos.filter((v) => v.videoId !== videoId));
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Failed to delete video",
          type: "error",
        },
      ]);
    }
  };

  // Loading placeholder
  if (loading) return <Loading message="Loading your channel" />;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-6 max-md:px-5">
      {/* Banner */}
      <div className="w-full h-44 md:h-56 lg:h-72 bg-black relative">
        <img
          src={
            user?.banner ||
            "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp"
          }
          alt="banner"
          className="w-full h-full object-cover brightness-75"
        />

        {/* Avatar */}
        <div className="absolute left-6 -bottom-16 md:-bottom-20 flex items-center">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#0f0f0f] shadow-lg"
          />
        </div>
      </div>

      {/* Channel header area */}
      <div className="max-w-6xl mx-auto -mt-12 ">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="ml-36">
            {/* left offset to account for avatar */}
            <h1 className="text-3xl md:text-4xl font-bold">
              {user?.username || "Channel"}
            </h1>
            <p className="text-gray-300 mt-4 text-sm font-semibold">
              @{(user?.username || "").replace(/\s/g, "")} •{" "}
              {user?.subscribers || 0} subscribers • {videos.length} videos
            </p>

            <p
              className={`text-gray-300 mt-3 max-w-3xl ${
                descOpen ? "" : "line-clamp-2"
              }`}
            >
              {user?.channelDescription ||
                "No description yet. Customize your channel to add one."}
            </p>
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="mt-2 text-sm text-gray-400 hover:underline"
            >
              {descOpen ? "Show less" : "...more"}
            </button>
          </div>

          <div className="flex items-center gap-3 ml-4 md:ml-0">
            <Link to="/profile/customize">
              <button className="px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-full text-sm">
                Customise channel
              </button>
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                try {
                  window.dispatchEvent(new Event("authChanged"));
                } catch (e) {}
                navigate("/");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-800">
          <div className="flex items-center gap-6">
            {["Videos", "Shorts", "Playlists", "Posts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}

            <div className="ml-auto mr-2">
              <button className="p-2 rounded-full bg-[#1a1a1a] text-gray-300">
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div>

        {/* Videos grid */}
        <div className="mt-6">
          {videos.length === 0 ? (
            <div className="text-gray-400 py-10">
              You haven't uploaded any videos yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div key={video.videoId} className="space-y-2">
                  <Link
                    to={`/watch/${video.videoId}`}
                    className="relative block rounded overflow-hidden"
                  >
                    <img
                      src={
                        video.thumbnailUrl ||
                        "https://via.placeholder.com/320x180?text=No+Thumbnail"
                      }
                      alt={video.title}
                      className="w-full h-44 object-cover rounded"
                    />
                  </Link>

                  <div>
                    {editingVideoId === video.videoId ? (
                      <div className="space-y-2 bg-[#0b0b0b] p-3 rounded">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full p-2 bg-[#121212] border border-gray-800 rounded text-sm"
                        />

                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 bg-[#121212] border border-gray-800 rounded text-sm"
                          rows={2}
                        />

                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full p-2 bg-[#121212] border border-gray-800 rounded text-sm"
                        >
                          <option>Frontend</option>
                          <option>JavaScript</option>
                          <option>Design</option>
                          <option>Backend</option>
                          <option>Database</option>
                          <option>Podcast</option>
                          <option>Mobile</option>
                          <option>DevOps</option>
                          <option>Data Science</option>
                          <option>AI/ML</option>
                          <option>Cloud</option>
                          <option>Security</option>
                          <option>Tools</option>
                          <option>Testing</option>
                          <option>Tutorials</option>
                          <option>Other</option>
                        </select>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateVideo(video.videoId)}
                            className="px-3 py-1 bg-green-600 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-600 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {video.views?.toLocaleString() || 0} views •{" "}
                          {new Date(video.uploadDate).toLocaleDateString()}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => startEditing(video)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteVideo(video.videoId)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------
       * Toast Notifications
       * -------------------------------------------------------- */}
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
