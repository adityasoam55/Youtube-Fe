/**
 * Watch Video Page Component
 * Displays a single video with player, title, description, like/dislike buttons, and comments section.
 * Tracks video views, handles user likes/dislikes, and displays suggested videos by category.
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentBox from "../components/CommentBox";

const API_BASE_URL = "http://localhost:5000/api";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);

  // Increment view count once when the page loads
  useEffect(() => {
    axios
      .put(`${API_BASE_URL}/videos/${id}/view`)
      .catch((err) => console.error(err));
  }, [id]);

  // Load suggested videos based on category
  useEffect(() => {
    if (!video) return;

    const loadSuggested = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/videos/suggest/${video.category}/${video.videoId}`
        );
        setSuggested(data);
      } catch (err) {
        console.error("Error loading suggested videos:", err);
      }
    };

    loadSuggested();
  }, [video]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const reloadVideo = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/videos/${id}`);
      setVideo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!token) return alert("Please login to like videos");

    try {
      await axios.put(
        `${API_BASE_URL}/videos/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await reloadVideo();
    } catch (err) {
      alert(err.response?.data?.message || "Could not like video");
    }
  };

  const handleDislike = async () => {
    if (!token) return alert("Please login to dislike videos");

    try {
      await axios.put(
        `${API_BASE_URL}/videos/${id}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await reloadVideo();
    } catch (err) {
      alert(err.response?.data?.message || "Could not dislike video");
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/videos/${id}`);
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!video) return <p className="p-6">Video not found.</p>;

  // Decide how to render: if videoUrl contains "youtube.com/embed", use iframe
  const isYouTubeEmbed = /youtube\.com\/embed\//i.test(video.videoUrl);
  const isYouTube = /youtube\.com\/watch\?v=|youtu\.be\//i.test(video.videoUrl);
  const isMP4 = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(video.videoUrl);

  // If non-embed YouTube link was saved, convert to embed for the iframe
  const getEmbedUrl = (url) => {
    if (isYouTubeEmbed) return video.videoUrl;
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  };

  const player = isMP4 ? (
    <video src={video.videoUrl} controls className="w-full rounded-xl" />
  ) : isYouTube || isYouTubeEmbed ? (
    <iframe
      className="w-full h-[500px] rounded-xl"
      src={getEmbedUrl(video.videoUrl)}
      title={video.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    // fallback try mp4 <video>
    <video src={video.videoUrl} controls className="w-full rounded-xl" />
  );

  return (
    <div className="flex flex-col md:flex-row p-6 gap-8">
      <div className="flex-1">
        {player}

        <h1 className="text-xl font-bold mt-3">{video.title}</h1>
        <p className="text-gray-600">{video.description}</p>

        <div className="flex gap-4 mt-3">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            👍 {video.likes.length}
          </button>

          <button
            onClick={handleDislike}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            👎 {video.dislikes.length}
          </button>
        </div>

        <CommentBox video={video} setVideo={setVideo} />
      </div>

      <div className="w-full md:w-80">
        <h2 className="font-semibold text-lg mb-3">Suggested Videos</h2>

        {suggested.length === 0 && (
          <p className="text-gray-500">No suggestions available</p>
        )}

        <div className="space-y-4">
          {suggested.map((vid) => (
            <a
              key={vid.videoId}
              href={`/watch/${vid.videoId}`}
              className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="w-32 h-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{vid.title}</p>
                <p className="text-sm text-gray-600">{vid.uploader}</p>
                <p className="text-xs text-gray-500">{vid.views} views</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
