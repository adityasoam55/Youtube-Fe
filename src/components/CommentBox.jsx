import React, { useState } from "react";

export default function CommentBox({ video, setVideo }) {
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const addComment = async () => {
    if (!user) return alert("Login required!");

    try {
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

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Could not post comment");
      }

      const newComment = await res.json();

      setVideo({
        ...video,
        comments: [...(video.comments || []), newComment],
      });

      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (c) => {
    setEditingComment(c.commentId);
    setEditText(c.text);
  };

  const submitEdit = async (commentId) => {
    if (!token) return alert("Login required to edit comment");

    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${video.videoId}/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editText }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Could not edit comment");
      }

      const updatedVideo = await res.json();
      setVideo(updatedVideo);
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    if (!token) return alert("Login required to delete comment");

    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${video.videoId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Could not delete comment");
      }

      const updatedVideo = await res.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">
        {video.comments?.length || 0} Comments
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
        {video.comments?.map((c) => (
          <div key={c.commentId} className="flex gap-3">
            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              <p className="font-semibold">{c.username}</p>

              {editingComment === c.commentId ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitEdit(c.commentId)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>{c.text}</p>
              )}

              {c.userId === user?.userId && (
                <div className="flex gap-2 text-sm mt-2">
                  <button onClick={() => startEditing(c)}>Edit</button>
                  <button
                    onClick={() => deleteComment(c.commentId)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
