/**
 * Comment Box Component
 * Handles adding, editing, and deleting comments on a video.
 * Only the comment author can edit or delete their own comments.
 */

import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function CommentBox({ video, setVideo }) {
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const addComment = async () => {
    if (!user) return alert("Login required!");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/comments/${video.videoId}`,
        {
          userId: user.userId,
          username: user.username,
          avatar: user.avatar,
          text: comment,
        }
      );

      setVideo({
        ...video,
        comments: [...(video.comments || []), data],
      });

      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not post comment");
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
      const { data } = await axios.put(
        `${API_BASE_URL}/comments/${video.videoId}/comment/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVideo(data);
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not edit comment");
    }
  };

  const deleteComment = async (commentId) => {
    if (!token) return alert("Login required to delete comment");

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/comments/${video.videoId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVideo(data);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete comment");
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
