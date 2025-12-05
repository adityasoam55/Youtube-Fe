/**
 * Comment Box Component
 * ----------------------
 * - Displays comment list for a video.
 * - Allows logged-in users to add new comments.
 * - Allows only the comment author to edit or delete their own comments.
 * - Uses toast notifications for feedback (success, error, warning).
 */

import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Toast from "./Toast";

export default function CommentBox({ video, setVideo }) {
  // New comment input field
  const [comment, setComment] = useState("");

  // Logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Toast list for notifications
  const [toastList, setToastList] = useState([]);

  /**
   * addComment()
   * ------------
   * Adds a new comment to the current video.
   * Requires user login.
   */
  const addComment = async () => {
    if (!user) {
      setToastList([
        ...toastList,
        { id: Date.now(), message: "Login required!", type: "warning" },
      ]);
      return;
    }

    // Prevent empty or whitespace-only comments
    if (!comment || comment.trim() === "") {
      setToastList([
        ...toastList,
        { id: Date.now(), message: "Comment cannot be empty", type: "warning" },
      ]);
      return;
    }

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

      // Append new comment to video state
      setVideo({
        ...video,
        comments: [...(video.comments || []), data],
      });

      setComment(""); // Clear input
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Could not post comment",
          type: "error",
        },
      ]);
    }
  };

  // Editing state
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  /**
   * startEditing()
   * --------------
   * Activates edit mode for a selected comment.
   */
  const startEditing = (c) => {
    setEditingComment(c.commentId);
    setEditText(c.text);
  };

  /**
   * submitEdit()
   * ------------
   * Saves updated comment text.
   * Requires authentication and ownership.
   */
  const submitEdit = async (commentId) => {
    if (!token) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: "Login required to edit comment",
          type: "warning",
        },
      ]);
      return;
    }

    try {
      // Prevent empty edits
      if (!editText || editText.trim() === "") {
        setToastList([
          ...toastList,
          {
            id: Date.now(),
            message: "Comment cannot be empty",
            type: "warning",
          },
        ]);
        return;
      }
      const { data } = await axios.put(
        `${API_BASE_URL}/comments/${video.videoId}/comment/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace entire video object with updated version from backend
      setVideo(data);

      setEditingComment(null);
      setEditText("");
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Could not edit comment",
          type: "error",
        },
      ]);
    }
  };

  /**
   * deleteComment()
   * ---------------
   * Deletes a comment from the video.
   * Requires user to be the comment owner.
   */
  const deleteComment = async (commentId) => {
    if (!token) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: "Login required to delete comment",
          type: "warning",
        },
      ]);
      return;
    }

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/comments/${video.videoId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend returns updated video with comment removed
      setVideo(data);
    } catch (err) {
      setToastList([
        ...toastList,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Could not delete comment",
          type: "error",
        },
      ]);
    }
  };

  return (
    <div className="mt-8">
      {/* Comments Count */}
      <h2 className="text-lg font-semibold mb-4">
        {video.comments?.length || 0} Comments
      </h2>

      {/* ------------------------------
          ADD COMMENT SECTION
      -------------------------------- */}
      <div className="flex flex-wrap items-start gap-3 mb-4 w-full">
        {/* User Avatar */}
        <img
          src={user?.avatar}
          alt=""
          className="w-10 h-10 rounded-full shrink-0"
        />

        {/* Comment Input */}
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 p-2 border rounded-lg min-w-[180px]"
        />

        {/* Submit Button */}
        <button
          onClick={addComment}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg whitespace-nowrap"
        >
          Comment
        </button>
      </div>

      {/* ------------------------------
          COMMENT LIST SECTION
      -------------------------------- */}
      <div className="space-y-4">
        {video.comments?.map((c) => (
          <div key={c.commentId} className="flex gap-3">
            {/* Commenter Avatar */}
            <img src={c.avatar} alt="" className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              {/* Username */}
              <p className="font-semibold">{c.username}</p>

              {/* Edit Mode UI */}
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
                // Normal Comment Text Display
                <p>{c.text}</p>
              )}

              {/* Edit/Delete Buttons (Only show for owner) */}
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

      {/* Toast Notifications */}
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToastList(toastList.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </div>
  );
}
