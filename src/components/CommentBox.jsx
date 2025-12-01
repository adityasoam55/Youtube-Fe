import React, { useState } from "react";

export default function CommentBox({ video, setVideo }) {
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const addComment = async () => {
    if (!user) return alert("Login required!");

    const res = await fetch(
      `http://localhost:5000/api/comments/${video.videoId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          username: user.username,
          avatar: user.avatar,
          text: comment,
        }),
      }
    );

    const newComment = await res.json();

    setVideo({
      ...video,
      comments: [...video.comments, newComment],
    });

    setComment("");
  };

  const deleteComment = async (commentId) => {
    await fetch(
      `http://localhost:5000/api/comments/${video.videoId}/${commentId}`,
      {
        method: "DELETE",
      }
    );

    setVideo({
      ...video,
      comments: video.comments.filter((c) => c.commentId !== commentId),
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">
        {video.comments.length} Comments
      </h2>

      {/* ADD COMMENT */}
      <div className="flex gap-3 mb-4">
        <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full" />
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={addComment}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Comment
        </button>
      </div>

      {/* COMMENT LIST */}
      <div className="space-y-4">
        {video.comments.map((c) => (
          <div key={c.commentId} className="flex gap-3">
            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              <p className="font-semibold">{c.username}</p>
              <p>{c.text}</p>
              <button
                onClick={() => deleteComment(c.commentId)}
                className="text-sm text-red-500 mt-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
