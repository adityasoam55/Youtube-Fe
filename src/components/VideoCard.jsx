import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {

  return (
    <Link to={`/watch/${video._id}`} className="block">
      <div className="w-full">
        {/* Thumbnail */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Video Info */}
        <div className="flex mt-3 gap-3">
          {/* Channel Avatar */}
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[15px] leading-tight">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600">{video.channelName}</p>
            <p className="text-sm text-gray-500">{video.views} views</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
