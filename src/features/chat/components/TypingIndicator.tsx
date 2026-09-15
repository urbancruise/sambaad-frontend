"use client";

import React from "react";

interface TypingIndicatorProps {
  label: string; // e.g. "Priya is typing…" or "3 people are typing…"
}

export default function TypingIndicator({ label }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
      </span>
      <span>{label}</span>
    </div>
  );
}