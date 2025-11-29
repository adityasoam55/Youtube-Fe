import React from "react";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const videos = [
    {
      videoId: "video01",
      title: "Learn React in 30 Minutes",
      thumbnailUrl: "https://i.ytimg.com/vi/Tn6-PIqc4UM/maxresdefault.jpg",
      description: "A quick tutorial to get started with React.",
      channelId: "channel01",
      uploader: "user01",
      views: 15200,
      likes: 1023,
      dislikes: 45,
      uploadDate: "2024-09-20",
      comments: [
        {
          commentId: "comment01",
          userId: "user02",
          text: "Great video! Very helpful.",
          timestamp: "2024-09-21T08:30:00Z",
        },
      ],
    },
    {
      videoId: "video02",
      title: "Master JavaScript in 60 Minutes",
      thumbnailUrl: "https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
      description: "Complete JavaScript crash course for beginners.",
      channelId: "channel02",
      uploader: "user05",
      views: 98500,
      likes: 5400,
      dislikes: 90,
      uploadDate: "2024-08-12",
      comments: [
        {
          commentId: "comment02",
          userId: "user07",
          text: "Super informative! Thanks.",
          timestamp: "2024-08-15T10:15:00Z",
        },
      ],
    },
    {
      videoId: "video03",
      title: "CSS Flexbox & Grid Explained",
      thumbnailUrl: "https://i.ytimg.com/vi/UMMHsQPmfug/maxresdefault.jpg",
      description: "Learn modern layout techniques using Flexbox and Grid.",
      channelId: "channel03",
      uploader: "user11",
      views: 45600,
      likes: 2100,
      dislikes: 32,
      uploadDate: "2024-07-05",
      comments: [
        {
          commentId: "comment03",
          userId: "user15",
          text: "Flexbox finally makes sense!",
          timestamp: "2024-07-06T13:45:00Z",
        },
      ],
    },
    {
      videoId: "video04",
      title: "Node.js & Express Crash Course",
      thumbnailUrl: "https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg",
      description:
        "Learn backend development with Node.js and Express.js in this comprehensive crash course.",
      channelId: "channel04",
      uploader: "user20",
      views: 74200,
      likes: 3200,
      dislikes: 41,
      uploadDate: "2024-11-01",
      comments: [
        {
          commentId: "comment04",
          userId: "user08",
          text: "Best explanation I've seen!",
          timestamp: "2024-11-02T09:20:00Z",
        },
      ],
    },
    {
      videoId: "video05",
      title: "Tailwind CSS Full Course",
      thumbnailUrl: "https://i.ytimg.com/vi/lCxcTsOHrjo/maxresdefault.jpg",
      description:
        "Learn Tailwind CSS from scratch and build beautiful UIs with utility-first styling.",
      channelId: "channel05",
      uploader: "user29",
      views: 38900,
      likes: 1700,
      dislikes: 25,
      uploadDate: "2024-06-18",
      comments: [
        {
          commentId: "comment05",
          userId: "user19",
          text: "Tailwind is awesome!",
          timestamp: "2024-06-20T14:10:00Z",
        },
      ],
    },
    {
      videoId: "video06",
      title: "MongoDB Tutorial for Beginners",
      thumbnailUrl: "https://i.ytimg.com/vi/tpT4e3OeEo0/maxresdefault.jpg",
      description: "Understand MongoDB database fundamentals step by step.",
      channelId: "channel06",
      uploader: "user33",
      views: 129000,
      likes: 6200,
      dislikes: 70,
      uploadDate: "2024-10-10",
      comments: [
        {
          commentId: "comment06",
          userId: "user25",
          text: "Very clear explanation.",
          timestamp: "2024-10-11T11:50:00Z",
        },
      ],
    },
  ];

  return (
    <div className="px-5 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
}
