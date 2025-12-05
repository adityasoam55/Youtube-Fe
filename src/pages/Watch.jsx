/**
 * Watch Video Page Component
 *
 * Responsibilities:
 * - Fetch and display a single video using its videoId (URL param)
 * - Auto-increment view count when video is opened
 * - Allow authenticated users to like/dislike videos
 * - Display embedded YouTube player or HTML5 <video> player based on URL
 * - Load suggested videos from the same category
 * - Render comments section using CommentBox component
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import CommentBox from "../components/CommentBox";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function Watch() {
  const { id } = useParams(); // current videoId from URL

  // -------------------------------
  // State variables
  // -------------------------------
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const [toastList, setToastList] = useState([]);

  // -------------------------------
  // Auto-increment view count
  // Runs only once when video opens
  // -------------------------------
  useEffect(() => {
    axios
      .put(`${API_BASE_URL}/videos/${id}/view`)
      .catch((err) => console.error(err));
  }, [id]);

  // -------------------------------
  // Load suggested videos
  // Runs only when main video data is loaded
  // -------------------------------
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

  // -------------------------------
  // Reload video after like/dislike
  // -------------------------------
  const reloadVideo = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/videos/${id}`);
      setVideo(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // Handle Like Action
  // -------------------------------
  const handleLike = async () => {
    if (!token) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: "Please login to like videos",
          type: "warning",
        },
      ]);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await reloadVideo();
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Could not like video",
          type: "error",
        },
      ]);
    }
  };

  // -------------------------------
  // Handle Dislike Action
  // -------------------------------
  const handleDislike = async () => {
    if (!token) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: "Please login to dislike videos",
          type: "warning",
        },
      ]);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/videos/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await reloadVideo();
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Could not dislike video",
          type: "error",
        },
      ]);
    }
  };

  // -------------------------------
  // Load video by ID when page opens
  // -------------------------------
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

  // Loading / Video Not Found
  if (loading) return <Loading message="Loading video" />;
  if (!video) return <p className="p-6">Video not found.</p>;

  // -------------------------------
  // Decide Player Type (YouTube / MP4 / Fallback)
  // -------------------------------
  const isYouTubeEmbed = /youtube\.com\/embed\//i.test(video.videoUrl);
  const isYouTube = /youtube\.com\/watch\?v=|youtu\.be\//i.test(video.videoUrl);
  const isMP4 = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(video.videoUrl);

  // Convert non-embed YouTube links into embed format for iframe player
  const getEmbedUrl = (url) => {
    if (isYouTubeEmbed) return video.videoUrl;

    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    return url;
  };

  // Determine which player UI to use
  const player = isMP4 ? (
    // Native HTML5 video player for MP4 links
    <video
      src={video.videoUrl}
      controls
      className="w-full rounded-xl h-56 sm:h-72 md:h-[500px] object-cover"
    />
  ) : isYouTube || isYouTubeEmbed ? (
    // YouTube iframe player
    <iframe
      className="w-full h-56 sm:h-72 md:h-[500px] rounded-xl"
      src={getEmbedUrl(video.videoUrl)}
      title={video.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    // Fallback attempt as MP4
    <video
      src={video.videoUrl}
      controls
      className="w-full rounded-xl h-56 sm:h-72 md:h-[500px] object-cover"
    />
  );

  // -------------------------------
  // JSX Return (Main Layout)
  // -------------------------------
  return (
    <div className="flex flex-col md:flex-row p-6 gap-8">
      {/* -------------------------------
          LEFT SIDE: Main Video Player
      -------------------------------- */}
      <div className="flex-1">
        {player}

        {/* Video Title */}
        <h1 className="text-xl font-bold mt-3">{video.title}</h1>

        {/* Video Description */}
        <p className="text-gray-600">{video.description}</p>

        {/* Like / Dislike Buttons */}
        <div className="flex flex-wrap gap-3 mt-3">
          <button
            onClick={handleLike}
            className="px-4 py-2 rounded-md bg-gray-200 flex-1 sm:flex-none min-w-[90px] text-center"
          >
            👍 {video.likes.length}
          </button>

          <button
            onClick={handleDislike}
            className="px-4 py-2 rounded-md bg-gray-200 flex-1 sm:flex-none min-w-[90px] text-center"
          >
            👎 {video.dislikes.length}
          </button>
        </div>

        {/* Comments Section */}
        <CommentBox video={video} setVideo={setVideo} />
      </div>

      {/* -------------------------------
          RIGHT SIDE: Suggested Videos
      -------------------------------- */}
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
