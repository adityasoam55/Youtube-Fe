/**
 * Watch Video Page Component
 * Displays a single video with player, title, description, like/dislike buttons, and comments section.
 * Tracks video views, handles user likes/dislikes, and displays suggested videos by category.
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import CommentBox from "../components/CommentBox";
import Loading from "../components/Loading";

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

  if (loading) return <Loading message="Loading video" />;
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
    <video
      src={video.videoUrl}
      controls
      className="w-full rounded-xl h-56 sm:h-72 md:h-[500px] object-cover"
    />
  ) : isYouTube || isYouTubeEmbed ? (
    <iframe
      className="w-full h-56 sm:h-72 md:h-[500px] rounded-xl"
      src={getEmbedUrl(video.videoUrl)}
      title={video.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    // fallback try mp4 <video>
    <video
      src={video.videoUrl}
      controls
      className="w-full rounded-xl h-56 sm:h-72 md:h-[500px] object-cover"
    />
  );

  return (
    <div className="flex flex-col md:flex-row p-6 gap-8">
      <div className="flex-1">
        {player}

        <h1 className="text-xl font-bold mt-3">{video.title}</h1>
        <p className="text-gray-600">{video.description}</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <button
            onClick={handleLike}
            className="w-full sm:w-auto px-4 py-3 bg-gray-200 rounded-md text-center"
          >
            👍 {video.likes.length}
          </button>

          <button
            onClick={handleDislike}
            className="w-full sm:w-auto px-4 py-3 bg-gray-200 rounded-md text-center"
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
            <Link
              key={vid.videoId}
              to={`/watch/${vid.videoId}`}
              className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg transition items-start"
            >
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="w-28 h-16 md:w-32 md:h-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{vid.title}</p>
                <p className="text-sm text-gray-600">{vid.uploader}</p>
                <p className="text-xs text-gray-500">{vid.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
