"use client";

import React from "react";

// Curated set covering the common WhatsApp-style reactions plus a
// broader picker grid. Kept dependency-free and simple by design.
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const EMOJI_GRID = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜", "🤔", "😴",
  "😎", "🥳", "😢", "😭", "😡", "🤯", "😱", "🙄", "😇", "🤗",
  "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "✌️", "🤞", "👌",
  "❤️", "🔥", "🎉", "✅", "❌", "⚠️", "💯", "⭐", "📌", "🚀",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  mode?: "reaction" | "full";
}

export default function EmojiPicker({ onSelect, onClose, mode = "full" }: EmojiPickerProps) {
  if (mode === "reaction") {
    return (
      <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1 z-20">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-lg hover:scale-125 transition-transform p-1"
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute bottom-full mb-2 right-0 w-64 max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-40 grid grid-cols-8 gap-1">
        {EMOJI_GRID.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}