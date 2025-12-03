/**
 * Upload Video Page Component
 * Allows authenticated users to upload videos by providing title, description, category, and video URL.
 * Supports YouTube links and direct MP4/video URLs.
 * Stores video metadata on backend and redirects to Watch page on success.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [videoLink, setVideoLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      setError("You must be logged in!");
      return;
    }

    if (!videoLink || !title) {
      setError("Please provide a title and a video link (YouTube or MP4).");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE_URL}/videos/upload`,
        {
          title,
          description,
          category,
          channelId: user.userId,
          uploader: user.username,
          videoUrl: videoLink,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      navigate(`/watch/${data.video.videoId}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to save video");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Video by URL</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Video title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Short description (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Frontend</option>
            <option>JavaScript</option>
            <option>Design</option>
            <option>Backend</option>
            <option>Database</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Video Link (YouTube or MP4)
          </label>
          <input
            required
            type="url"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. https://www.youtube.com/watch?v=VIDEOID or https://example.com/video.mp4"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Video"}
        </button>
      </form>
    </div>
  );
}
