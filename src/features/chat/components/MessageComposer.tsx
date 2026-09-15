"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send, Paperclip, Smile, X, Loader2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { emitEditMessage, emitSendMessage, emitTyping } from "../hooks/useChatSocket";
import { uploadChatFile } from "../api/chat.service";
import { Attachment, ChatUser, Message } from "../types";

interface MessageComposerProps {
  conversationId: string;
  participants: ChatUser[];
  replyingTo: Message | null;
  onCancelReply: () => void;
  editingMessage: Message | null;
  onCancelEdit: () => void;
}

const TYPING_STOP_DELAY = 2000;

export default function MessageComposer({
  conversationId,
  participants,
  replyingTo,
  onCancelReply,
  editingMessage,
  onCancelEdit,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<ChatUser[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.body ?? "");
    }
  }, [editingMessage]);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emitTyping(conversationId, false);
    }
  }, [conversationId]);

  useEffect(() => stopTyping, [conversationId, stopTyping]);

  const handleTextChange = (value: string) => {
    setText(value);

    if (!editingMessage) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        emitTyping(conversationId, true);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY);
    }

    const lastAt = value.lastIndexOf("@");
    if (lastAt >= 0 && (lastAt === 0 || value[lastAt - 1] === " ")) {
      const query = value.slice(lastAt + 1);
      if (!query.includes(" ")) {
        setMentionQuery(query.toLowerCase());
        return;
      }
    }
    setMentionQuery(null);
  };

  const insertMention = (user: ChatUser) => {
    const lastAt = text.lastIndexOf("@");
    const newText = `${text.slice(0, lastAt)}@${user.fullName} `;
    setText(newText);
    setSelectedMentions((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
    setMentionQuery(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const attachment = await uploadChatFile(file);
      setPendingAttachments((prev) => [...prev, attachment]);
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && pendingAttachments.length === 0) return;

    stopTyping();
    setSending(true);

    try {
      if (editingMessage) {
        emitEditMessage(editingMessage.id, trimmed);
        onCancelEdit();
      } else {
        const mentions = selectedMentions.filter((u) => trimmed.includes(u.fullName)).map((u) => u.id);

        const ack = await emitSendMessage({
          conversationId,
          body: trimmed || undefined,
          replyToId: replyingTo?.id,
          mentions,
          attachments: pendingAttachments,
        });

        if (!ack.ok) {
          console.error("Failed to send message:", ack.error);
          return;
        }

        onCancelReply();
      }

      setText("");
      setPendingAttachments([]);
      setSelectedMentions([]);
    } finally {
      setSending(false);
    }
  };

  const mentionMatches = mentionQuery !== null
    ? participants.filter((p) => p.fullName.toLowerCase().includes(mentionQuery)).slice(0, 5)
    : [];

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
      {(replyingTo || editingMessage) && (
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 mb-2 border-l-2 border-[#03C35E]">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#03C35E]">
              {editingMessage ? "Editing message" : `Replying to ${replyingTo?.sender.fullName}`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {editingMessage ? editingMessage.body : replyingTo?.body ?? "Attachment"}
            </p>
          </div>
          <button
            onClick={editingMessage ? onCancelEdit : onCancelReply}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {pendingAttachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-xs"
            >
              <span className="truncate max-w-[140px]">{att.fileName}</span>
              <button onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-rose-500">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2">
        {mentionMatches.length > 0 && (
          <div className="absolute bottom-full mb-2 left-0 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-20">
            {mentionMatches.map((user) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {user.fullName}
              </button>
            ))}
          </div>
        )}

        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
          title="Attach file"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
        </button>

        <div className="relative flex-1">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            rows={1}
            className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#03C35E]/40 max-h-32"
          />
          <button
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="absolute right-2 bottom-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Smile size={18} />
          </button>
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={(emoji) => setText((t) => t + emoji)}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={sending || (!text.trim() && pendingAttachments.length === 0)}
          className="p-2.5 rounded-full bg-[#03C35E] text-white disabled:opacity-40 shrink-0 hover:bg-[#02a850] transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}