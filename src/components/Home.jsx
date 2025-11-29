import React from "react";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const videos = [
    {
      _id: "1",
      title: "React Tutorial for Beginners",
      channelName: "Code Academy",
      views: "1.2M",
      thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg",
      channelAvatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      _id: "2",
      title: "JavaScript Full Course",
      channelName: "FreeCodeCamp",
      views: "3.5M",
      thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
      channelAvatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      _id: "3",
      title: "Tailwind CSS Crash Course",
      channelName: "DevLook",
      views: "800K",
      thumbnail: "https://i.ytimg.com/vi/lCxcTsOHrjo/maxresdefault.jpg",
      channelAvatar: "https://i.pravatar.cc/150?img=15",
    },
  ];

  return (
    <div className="px-5 py-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
