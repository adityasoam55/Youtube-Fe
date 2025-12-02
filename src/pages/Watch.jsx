// src/pages/Watch.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);

  // Increment view count once when the page loads
  useEffect(() => {
    fetch(`http://localhost:5000/api/videos/${id}/view`, {
      method: "PUT",
    }).catch((err) => console.error(err));
  }, [id]);

  // Load suggested videos based on category
  useEffect(() => {
    if (!video) return;

    const loadSuggested = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/videos/suggest/${video.category}/${video.videoId}`
        );
        const data = await res.json();
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
      const res = await fetch(`http://localhost:5000/api/videos/${id}`);
      const data = await res.json();
      setVideo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!token) return alert("Please login to like videos");

    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}/like`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Could not like video");
      }

      await reloadVideo();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!token) return alert("Please login to dislike videos");

    try {
      const res = await fetch(
        `http://localhost:5000/api/videos/${id}/dislike`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Could not dislike video");
      }

      await reloadVideo();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
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
