"use client";

import React from "react";
import { Users } from "lucide-react";
import { ConversationSummary } from "../types";

interface ConversationListItemProps {
  conversation: ConversationSummary;
  currentUserId: number;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
}

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "2-digit", month: "short" });
};

export default function ConversationListItem({
  conversation,
  currentUserId,
  isActive,
  isOnline,
  onClick,
}: ConversationListItemProps) {
  const isGroup = conversation.type === "GROUP";
  const otherParticipant = !isGroup
    ? conversation.participants.find((p) => p.id !== currentUserId)
    : null;

  const displayName = isGroup ? conversation.name ?? "Group" : otherParticipant?.fullName ?? "Unknown";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const previewText = conversation.lastMessage
    ? conversation.lastMessage.isDeleted
      ? "This message was deleted"
      : conversation.lastMessage.type === "IMAGE" || conversation.lastMessage.type === "FILE"
      ? "📎 Attachment"
      : conversation.lastMessage.body ?? ""
    : "No messages yet";

  const previewPrefix =
    conversation.lastMessage && conversation.lastMessage.sender.id === currentUserId ? "You: " : "";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
        isActive ? "bg-[#03C35E]/10" : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
          {isGroup ? <Users size={18} /> : initials}
        </div>
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#03C35E] border-2 border-white dark:border-slate-900" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
          <span className="text-[11px] text-slate-400 shrink-0">{formatTime(conversation.lastMessageAt)}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {previewPrefix}
            {previewText}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-[#03C35E] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
              {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}