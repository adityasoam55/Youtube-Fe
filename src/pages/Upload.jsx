/**
 * Upload Video Page - YouTube Studio Light Style
 *
 * Allows authenticated users to upload a new video by providing:
 *  - Title
 *  - Description
 *  - Category
 *  - YouTube link or direct MP4 link
 *
 * After successful upload, the user is redirected to the video Watch page.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Upload() {
  const navigate = useNavigate();

  // ----------------------------
  // Form State Variables
  // ----------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [videoLink, setVideoLink] = useState("");

  // Upload state helpers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Handle Upload Form Submission
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // User must be logged in to upload a video
    if (!token || !user) {
      setError("You must be logged in!");
      return;
    }

    // Validate required fields
    if (!videoLink || !title) {
      setError("Please provide a title and a video link.");
      return;
    }

    try {
      setLoading(true);

      // Send video metadata to backend
      const { data } = await axios.post(
        `${API_BASE_URL}/videos/upload`,
        {
          title,
          description,
          category,
          channelId: user.userId, // User channel
          uploader: user.username, // Display name
          videoUrl: videoLink, // Video source link
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);

      // Redirect user to the watch page of the new video
      navigate(`/watch/${data.video.videoId}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to upload video");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        {/* Page Header */}
        <h2 className="text-2xl font-bold mb-6">Upload Video</h2>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Title Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Enter video title"
            />
          </div>

          {/* Video Description Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg h-24 bg-white border border-gray-300 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Short description (optional)"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
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
          </div>

          {/* Video URL Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Video URL (YouTube or MP4)
            </label>
            <input
              required
              type="url"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 
              focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder="https://youtube.com/watch?v=XYZ or direct MP4 link"
            />
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            className={`w-full py-3 text-white rounded-lg text-lg transition ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
