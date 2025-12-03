/**
 * Channel Management Page Component
 * Allows authenticated users to view and manage their uploaded videos.
 * Implements full CRUD operations: Create (Upload), Read (List), Update (Edit), Delete.
 * Features: Edit video title/description/category, delete videos, display video stats.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

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

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  // Fetch channel videos
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
        console.error("Failed to fetch channel videos:", err);
        alert(err.response?.data?.message || "Failed to load your videos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChannelVideos();
    }
  }, [token]);

  // Start editing a video
  const startEditing = (video) => {
    setEditingVideoId(video.videoId);
    setEditForm({
      title: video.title,
      description: video.description || "",
      category: video.category || "Frontend",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditForm({ title: "", description: "", category: "Frontend" });
  };

  // Update video (PUT)
  const handleUpdateVideo = async (videoId) => {
    if (!editForm.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/videos/channel/${videoId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update video in local state
      setVideos(
        videos.map((v) => (v.videoId === videoId ? { ...v, ...editForm } : v))
      );

      alert("Video updated successfully");
      cancelEditing();
    } catch (err) {
      console.error("Failed to update video:", err);
      alert(err.response?.data?.message || "Failed to update video");
    }
  };

  // Delete video (DELETE)
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/videos/channel/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove video from local state
      setVideos(videos.filter((v) => v.videoId !== videoId));
      alert("Video deleted successfully");
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert(err.response?.data?.message || "Failed to delete video");
    }
  };

  if (loading) return <p className="p-6">Loading your channel...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Channel</h1>
          <p className="text-gray-600 mt-2">
            Welcome, <span className="font-semibold">{user?.username}</span>
          </p>
        </div>

        <Link to="/upload">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Upload Video
          </button>
        </Link>
      </div>

      {/* Videos Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Your Videos ({videos.length})
        </h2>

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              You haven't uploaded any videos yet
            </p>
            <Link to="/upload">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload Your First Video
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Video Row */}
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={
                      video.thumbnailUrl ||
                      "https://via.placeholder.com/120x80?text=No+Thumbnail"
                    }
                    alt={video.title}
                    className="w-32 h-24 rounded object-cover"
                  />

                  {/* Video Info */}
                  <div className="flex-1">
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
                          placeholder="Video title"
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
                          placeholder="Video description"
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

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateVideo(video.videoId)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {video.description || "No description"}
                        </p>

                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 rounded">
                            {video.category}
                          </span>
                        </div>

                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => startEditing(video)}
                            className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteVideo(video.videoId)}
                            className="px-4 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>

                          <Link to={`/watch/${video.videoId}`}>
                            <button className="px-4 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-right text-sm text-gray-600">
                    <div className="text-lg font-semibold text-gray-800">
                      {video.likes?.length || 0}
                    </div>
                    <div>👍 Likes</div>
                    <div className="mt-2 text-lg font-semibold text-gray-800">
                      {video.dislikes?.length || 0}
                    </div>
                    <div>👎 Dislikes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
