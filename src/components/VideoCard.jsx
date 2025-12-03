/**
 * Video Card Component
 * Displays a single video as a card with thumbnail, title, uploader name, and view count.
 * Shows user's profile avatar when available, otherwise falls back to generated avatar.
 * Clicking the card navigates to the Watch page for that video.
 */

import React from "react";
import { Link } from "react-router-dom";

// Fallback avatars for channelId (legacy)
const getAvatar = (channelId) => {
  const avatars = {
    channel01: "https://i.pravatar.cc/150?img=5",
    channel02: "https://i.pravatar.cc/150?img=11",
    channel03: "https://i.pravatar.cc/150?img=15",
    channel04: "https://i.pravatar.cc/150?img=20",
    channel05: "https://i.pravatar.cc/150?img=25",
    channel06: "https://i.pravatar.cc/150?img=30",
  };
  return avatars[channelId] || "https://i.pravatar.cc/150?img=1";
};

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.videoId}`} className="block">
      <div className="w-full">
        {/* Thumbnail */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-200">
          <img
            src={
              video.thumbnailUrl && video.thumbnailUrl.trim() !== ""
                ? video.thumbnailUrl
                : "https://via.placeholder.com/320x180?text=No+Thumbnail"
            }
            alt={video.title}
            className="w-full h-44 object-cover rounded-lg"
          />
        </div>

        {/* Video Info */}
        <div className="flex mt-3 gap-3">
          {/* User avatar (real avatar > fallback avatar) */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
            <img
              src={
                video.uploaderAvatar && video.uploaderAvatar.trim() !== ""
                  ? video.uploaderAvatar
                  : getAvatar(video.channelId)
              }
              alt={video.uploader}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">
              {video.title}
            </h3>

            <p className="text-sm text-gray-600">{video.uploader}</p>

            <p className="text-sm text-gray-500">
              {video.views?.toLocaleString()} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
