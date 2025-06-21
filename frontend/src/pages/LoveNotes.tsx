import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  PlusIcon,
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  fetchLoveNotes,
  createLoveNote,
  markNoteAsRead,
  addNoteReaction,
  deleteLoveNote,
} from "../store/slices/appSlice";
import { LoadingSpinner } from "../components/LoadingSpinner";

const emotionTags = [
  "LOVE",
  "JOY",
  "GRATITUDE",
  "ROMANTIC",
  "SWEET",
  "PLAYFUL",
  "MISSING_YOU",
  "ADMIRATION",
] as const;

type EmotionTag = (typeof emotionTags)[number];

const LoveNotes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { 
    notes, 
    unreadCount, 
    loading, 
    error,
    notesTotalPages,
    notesTotalElements,
    currentNotePage 
  } = useAppSelector((state) => state.app);

  const [showForm, setShowForm] = React.useState(false);
  const [newNote, setNewNote] = React.useState({
    content: "",
    emotionTag: "LOVE" as EmotionTag,
  });

  // Fetch love notes when component mounts
  useEffect(() => {
    if (user) {
      dispatch(fetchLoveNotes(0));
    }
  }, [dispatch, user]);

  // Fetch love notes when page changes
  useEffect(() => {
    if (user && currentNotePage > 0) {
      dispatch(fetchLoveNotes(currentNotePage));
    }
  }, [dispatch, user, currentNotePage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < notesTotalPages) {
      dispatch(fetchLoveNotes(newPage));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.content.trim()) {
      toast.error("Please write something beautiful! 💕");
      return;
    }

    try {
      await dispatch(
        createLoveNote({
          content: newNote.content.trim(),
          emotionTag: newNote.emotionTag,
        })
      ).unwrap();
      setNewNote({ content: "", emotionTag: "LOVE" });
      setShowForm(false);
      toast.success("Love note sent successfully! 💌");
      // Go to first page to show the new note (newest first)
      dispatch(fetchLoveNotes(0));
    } catch (err) {
      toast.error("Failed to send love note 💔");
      console.error("Failed to create note:", err);
    }
  };

  const handleReaction = async (noteId: string, emoji: string) => {
    try {
      await dispatch(addNoteReaction({ noteId, emoji })).unwrap();
      toast.success("Reaction added! 💫");
    } catch (err) {
      toast.error("Failed to add reaction 😢");
      console.error("Failed to add reaction:", err);
    }
  };

  const handleMarkAsRead = async (noteId: string) => {
    try {
      await dispatch(markNoteAsRead(noteId)).unwrap();
      toast.success("Note marked as read 👀");
    } catch (err) {
      toast.error("Failed to mark note as read 😢");
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await dispatch(deleteLoveNote(noteId)).unwrap();
      toast.success("Note deleted 🗑️");
      // Refresh the current page after deletion
      dispatch(fetchLoveNotes(currentNotePage));
    } catch (err) {
      toast.error("Failed to delete note 😢");
      console.error("Failed to delete note:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair text-pink-600">Love Notes</h1>
          {notesTotalElements > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Total: {notesTotalElements} notes
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          {showForm ? (
            <>
              <HeartIcon className="w-5 h-5" />
              <span>Close</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              <span>New Note</span>
            </>
          )}
        </button>
      </div>

      {unreadCount > 0 && (
        <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <p className="text-pink-600">
            You have {unreadCount} unread note{unreadCount !== 1 ? "s" : ""}! 💌
          </p>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your love note here... 💕"
                className="w-full p-4 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={newNote.emotionTag}
                onChange={(e) =>
                  setNewNote((prev) => ({
                    ...prev,
                    emotionTag: e.target.value as EmotionTag,
                  }))
                }
                className="rounded-lg border border-pink-200 px-4 py-2"
              >
                {emotionTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag
                      .split("_")
                      .map(
                        (word) => word.charAt(0) + word.slice(1).toLowerCase()
                      )
                      .join(" ")}{" "}
                    {tag === "LOVE"
                      ? "❤️"
                      : tag === "JOY"
                      ? "😊"
                      : tag === "GRATITUDE"
                      ? "🙏"
                      : tag === "ROMANTIC"
                      ? "💖"
                      : tag === "SWEET"
                      ? "🍬"
                      : tag === "PLAYFUL"
                      ? "😜"
                      : tag === "MISSING_YOU"
                      ? "🥺"
                      : tag === "ADMIRATION"
                      ? "🌟"
                      : ""}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Send Note</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 rounded-lg shadow-lg ${
              note.read || note.isRead ? "bg-white" : "bg-pink-50"
            }`}
          >
            <div className="flex justify-between items-center text-gray-800 mb-4">
              <p>{note.content}</p>
              <span
                className={`flex ${
                  note.read ? "text-green-500" : "text-gray-400"
                }`}
              >
                <CheckIcon className="w-4 h-4 -mr-1" />
                <CheckIcon className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>{note.emotionTag}</span>
                {note.reactionEmoji && (
                  <span className="text-lg">{note.reactionEmoji}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {!(note.read || note.isRead) && (
                  <button
                    onClick={() => handleMarkAsRead(note.id)}
                    className="text-pink-500 hover:text-pink-600"
                  >
                    Mark as Read
                  </button>
                )}
                <div className="flex gap-2">
                  {["❤️", "😊", "🥰", "😘"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(note.id, emoji)}
                      className="hover:transform hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {notesTotalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentNotePage - 1)}
            disabled={currentNotePage === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentNotePage === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Page numbers */}
            {Array.from({ length: notesTotalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentNotePage === i
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentNotePage + 1)}
            disabled={currentNotePage === notesTotalPages - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentNotePage === notesTotalPages - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            <span>Next</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Page info */}
      {notesTotalPages > 1 && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Page {currentNotePage + 1} of {notesTotalPages} • Showing {notes.length} of {notesTotalElements} notes
        </div>
      )}
    </div>
  );
};

export default LoveNotes;
