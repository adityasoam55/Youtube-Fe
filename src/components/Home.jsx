import React, { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Frontend",
    "JavaScript",
    "Design",
    "Backend",
    "Database",
  ];

  // FETCH VIDEOS FROM BACKEND
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("http://localhost:5000/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  // FILTER LOGIC
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
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading videos...</p>
      ) : (
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
