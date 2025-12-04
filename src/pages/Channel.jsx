/**
 * Channel Management Page Component
 * Allows authenticated users to view and manage their uploaded videos.
 * Implements full CRUD operations.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function Channel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "Frontend",
  });
  const [toastList, setToastList] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user, navigate]);

  // Fetch user videos
  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/videos/channel/my-videos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchChannelVideos();
  }, [token]);

  // Start editing a video
  const startEditing = (video) => {
    setEditingVideoId(video.videoId);
    setEditForm({
      title: video.title,
      description: video.description || "",
      category: video.category,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditForm({ title: "", description: "", category: "Frontend" });
  };

  // Update video
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

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/videos/channel/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  if (loading) return <Loading message="Loading your channel" />;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Channel</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Welcome, <span className="font-semibold">{user?.username}</span>
          </p>
        </div>

        <Link to="/upload" className="w-full md:w-auto">
          <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Upload Video
          </button>
        </Link>
      </div>

      {/* Videos */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Your Videos ({videos.length})
      </h2>

      {videos.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You haven't uploaded any videos yet
          </p>
          <Link to="/upload">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Upload Your First Video
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:gap-4">
                {/* Thumbnail */}
                <img
                  src={
                    video.thumbnailUrl ||
                    "https://via.placeholder.com/240x140?text=No+Thumbnail"
                  }
                  alt={video.title}
                  className="w-full md:w-40 h-44 md:h-24 rounded object-cover mb-3 md:mb-0"
                />

                {/* Info */}
                <div className="flex-1 md:flex md:flex-col">
                  {editingVideoId === video.videoId ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />

                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        rows="2"
                      />

                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option>Frontend</option>
                        <option>JavaScript</option>
                        <option>Design</option>
                        <option>Backend</option>
                        <option>Database</option>
                      </select>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleUpdateVideo(video.videoId)}
                          className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="md:flex-1">
                      <h3 className="text-lg font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {video.description || "No description"}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                        {/* Left: Video Stats */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 rounded">
                            {video.category}
                          </span>
                        </div>

                        {/* Right: Edit / Delete / Play / LikeCount / DislikeCount */}
                        <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
                          <button
                            onClick={() => startEditing(video)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteVideo(video.videoId)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>

                          <Link to={`/watch/${video.videoId}`}>
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1">
                              <MdPlayArrow size={16} />
                              Play
                            </button>
                          </Link>

                          {/* 👍 Like Count */}
                          <span className="ml-auto flex items-center gap-1 text-gray-700 text-sm">
                            👍{" "}
                            <span className="font-semibold">
                              {video.likes?.length || 0}
                            </span>
                          </span>

                          {/* 👎 Dislike Count */}
                          <span className="flex items-center gap-1 text-gray-700 text-sm">
                            👎{" "}
                            <span className="font-semibold">
                              {video.dislikes?.length || 0}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
