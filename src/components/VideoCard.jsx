/**
 * Video Card Component
 * ----------------------------------------------------------
 * Renders an individual video preview card used on the Home page.
 *
 * Shows:
 * - Thumbnail image
 * - Channel avatar (real avatar if provided, otherwise fallback)
 * - Title (2-line clamp)
 * - Uploader name
 * - View count
 *
 * Clicking the card navigates to /watch/:videoId
 */

import React from "react";
import { Link } from "react-router-dom";

/**
 * getAvatar()
 * ----------------------------------------------------------
 * Returns a fallback avatar image based on channelId.
 * Used only when uploaderAvatar is missing.
 */
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
    // Entire card is wrapped in a Link → Clicking navigates to watch page
    <Link to={`/watch/${video.videoId}`} className="block">
      <div className="w-full">
        {/* ---------------- Thumbnail Section ---------------- */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-200">
          <img
            src={
              // Use thumbnail if available, else fallback placeholder
              video.thumbnailUrl && video.thumbnailUrl.trim() !== ""
                ? video.thumbnailUrl
                : "https://via.placeholder.com/320x180?text=No+Thumbnail"
            }
            alt={video.title}
            className="w-full h-44 object-cover rounded-lg"
          />
        </div>

        {/* ---------------- Video Info Section ---------------- */}
        <div className="flex mt-3 gap-3">
          {/* Channel Avatar (real > fallback) */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
            <img
              src={
                video.uploaderAvatar && video.uploaderAvatar.trim() !== ""
                  ? video.uploaderAvatar
                  : getAvatar(video.channelId) // fallback
              }
              alt={video.uploader}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + uploader + views */}
          <div className="flex flex-col justify-center">
            {/* Title - clamped to 2 lines */}
            <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">
              {video.title}
            </h3>

            {/* Uploader / Channel Name */}
            <p className="text-sm text-gray-600">{video.uploader}</p>

            {/* View count */}
            <p className="text-sm text-gray-500">
              {video.views?.toLocaleString()} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
