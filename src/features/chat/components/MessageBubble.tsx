"use client";

import React, { useState } from "react";
import { Reply, Smile, Pencil, Trash2, FileText, Download } from "lucide-react";
import { Message } from "../types";
import EmojiPicker from "./EmojiPicker";
import { emitToggleReaction, emitDeleteMessage } from "../hooks/useChatSocket";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: number;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const isImageAttachment = (mimeType: string) => mimeType.startsWith("image/");

export default function MessageBubble({ message, isOwn, currentUserId, onReply, onEdit }: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  if (message.type === "SYSTEM" || message.type === "CALL_LOG") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
          {message.body}
        </span>
      </div>
    );
  }

  // Group reactions by emoji -> count + whether current user reacted
  const groupedReactions = message.reactions.reduce<Record<string, { count: number; mine: boolean }>>(
    (acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = { count: 0, mine: false };
      acc[r.emoji].count += 1;
      if (r.user.id === currentUserId) acc[r.emoji].mine = true;
      return acc;
    },
    {}
  );

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4 py-0.5 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactionPicker(false);
      }}
    >
      <div className={`flex items-end gap-1.5 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
        <div className="relative">
          <div
            className={`rounded-2xl px-3.5 py-2 shadow-sm ${
              isOwn
                ? "bg-[#03C35E] text-white rounded-br-sm"
                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700"
            }`}
          >
            {!isOwn && message.sender && (
              <p className="text-[11px] font-semibold mb-0.5 text-[#03C35E]">{message.sender.fullName}</p>
            )}

            {message.replyTo && (
              <div
                className={`mb-1.5 rounded-lg px-2 py-1 border-l-2 text-xs ${
                  isOwn
                    ? "bg-white/15 border-white/60 text-white/90"
                    : "bg-slate-100 dark:bg-slate-700/60 border-[#03C35E] text-slate-600 dark:text-slate-300"
                }`}
              >
                <p className="font-semibold">{message.replyTo.sender.fullName}</p>
                <p className="truncate">{message.replyTo.isDeleted ? "This message was deleted" : message.replyTo.body}</p>
              </div>
            )}

            {message.isDeleted ? (
              <p className="italic text-sm opacity-70">This message was deleted</p>
            ) : (
              <>
                {message.attachments.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-1">
                    {message.attachments.map((att, i) =>
                      isImageAttachment(att.mimeType) ? (
                        <img
                          key={i}
                          src={att.fileUrl}
                          alt={att.fileName}
                          className="rounded-lg max-w-full max-h-64 object-cover"
                        />
                      ) : (
                        <a
                          key={i}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                            isOwn ? "bg-white/15" : "bg-slate-100 dark:bg-slate-700"
                          }`}
                        >
                          <FileText size={16} className="shrink-0" />
                          <span className="truncate flex-1">{att.fileName}</span>
                          <Download size={14} className="shrink-0" />
                        </a>
                      )
                    )}
                  </div>
                )}

                {message.body && <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>}
              </>
            )}

            <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "text-white/70" : "text-slate-400"}`}>
              <span className="text-[10px]">{formatTime(message.createdAt)}</span>
              {message.isEdited && !message.isDeleted && <span className="text-[10px] italic">edited</span>}
            </div>
          </div>

          {Object.keys(groupedReactions).length > 0 && (
            <div className={`flex gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
              {Object.entries(groupedReactions).map(([emoji, { count, mine }]) => (
                <button
                  key={emoji}
                  onClick={() => emitToggleReaction(message.id, emoji)}
                  className={`text-xs rounded-full px-1.5 py-0.5 border ${
                    mine
                      ? "bg-[#03C35E]/10 border-[#03C35E]/40"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {emoji} {count > 1 && count}
                </button>
              ))}
            </div>
          )}

          {showReactionPicker && (
            <EmojiPicker
              mode="reaction"
              onSelect={(emoji) => emitToggleReaction(message.id, emoji)}
              onClose={() => setShowReactionPicker(false)}
            />
          )}
        </div>

        {showActions && !message.isDeleted && (
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowReactionPicker((v) => !v)}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              title="React"
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => onReply(message)}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              title="Reply"
            >
              <Reply size={14} />
            </button>
            {isOwn && (
              <>
                <button
                  onClick={() => onEdit(message)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => emitDeleteMessage(message.id)}
                  className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}