/**
 * Home Page Component
 * Displays a grid of videos fetched from the backend.
 * Supports:
 *   - Searching videos via URL query (?search=term)
 *   - Filtering videos by categories (Frontend, JS, Backend, etc.)
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import VideoCard from "../components/VideoCard";
import Loading from "../components/Loading";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  // Extract search term from URL query params (?search=value)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  // All videos fetched from backend
  const [videos, setVideos] = useState([]);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Available categories for filtering
  const categories = [
    "All",
    "Frontend",
    "JavaScript",
    "Design",
    "Backend",
    "Database",
  ];

  /**
   * Fetch all videos from backend when component loads.
   * Runs only once due to empty dependency array.
   */
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/videos`);
        setVideos(data); // Store fetched videos
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    loadVideos();
  }, []);

  /**
   * FILTER LOGIC
   * - Matches search term (case insensitive)
   * - Matches selected category (or shows all when "All")
   */
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-5 py-6">
      {/* CATEGORY FILTER CHIPS */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)} // Update selected category
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-black text-white" // Active state
                : "bg-gray-100 hover:bg-gray-200" // Default state
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Show loader while fetching videos */}
      {loading ? (
        <Loading message="Loading videos" />
      ) : (
        /**
         * VIDEO GRID
         * Responsive layout that adjusts based on screen width.
         */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))
          ) : (
            <p className="text-gray-600">No videos found.</p>
          )}
        </div>
      )}
    </div>
  );
}
