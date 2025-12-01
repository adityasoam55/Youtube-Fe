import React from "react";
import { Link } from "react-router-dom";

// Fake auto-generated channel name & avatar from channelId
const getChannelName = (channelId) => {
  const names = {
    channel01: "Code Academy",
    channel02: "FreeCodeCamp",
    channel03: "Design School",
    channel04: "Node Mastery",
    channel05: "Tailwind Labs",
    channel06: "MongoDB University",
  };
  return names[channelId] || "Unknown Channel";
};

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
              video.thumbnailUrl ||
              video.thumbnailUrl ||
              "https://via.placeholder.com/320x180?text=No+Thumbnail"
            }
            alt={video.title}
            className="w-full h-44 object-cover rounded-lg"
          />
        </div>

        {/* Video Info */}
        <div className="flex mt-3 gap-3">
          {/* Channel Avatar */}
          <img
            src={getAvatar(video.channelId)}
            alt={video.channelId}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[15px] leading-tight line-clamp-2">
              {video.title}
            </h3>

            <p className="text-sm text-gray-600">
              {getChannelName(video.channelId)}
            </p>

            <p className="text-sm text-gray-500">
              {video.views.toLocaleString()} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
