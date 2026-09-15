"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Video, Users, ChevronLeft } from "lucide-react";
import { RootState } from "@/src/lib/store";
import { ConversationDetail, Message } from "../types";
import { getConversation, getMessages } from "../api/chat.service";
import { setMessages, prependMessages, setActiveConversation, setMessagesLoading } from "../store/chatSlice";
import { joinConversationRoom, leaveConversationRoom, emitMarkRead } from "../hooks/useChatSocket";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: number;
  onStartCall: (type: "AUDIO" | "VIDEO") => void;
  onBack?: () => void; // mobile: return to conversation list
}

const MESSAGE_PAGE_SIZE = 30;

export default function ChatWindow({ conversationId, currentUserId, onStartCall, onBack }: ChatWindowProps) {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.chat.messagesByConversation[conversationId]
  ) as Message[] | undefined;
  const hasMore = useSelector((state: RootState) => state.chat.hasMoreByConversation[conversationId]);
  const typingUserIds = useSelector(
    (state: RootState) => state.chat.typingByConversation[conversationId]
  ) as number[] | undefined;

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  // Load conversation detail + first page of messages, join the socket room
  useEffect(() => {
    let cancelled = false;

    dispatch(setActiveConversation(conversationId));
    joinConversationRoom(conversationId);

    (async () => {
      dispatch(setMessagesLoading(true));
      try {
        const [detail, history] = await Promise.all([
          getConversation(conversationId),
          getMessages(conversationId),
        ]);
        if (cancelled) return;

        setConversation(detail);
        dispatch(
          setMessages({
            conversationId,
            messages: history,
            hasMore: history.length === MESSAGE_PAGE_SIZE,
          })
        );
      } finally {
        if (!cancelled) dispatch(setMessagesLoading(false));
      }
    })();

    return () => {
      cancelled = true;
      leaveConversationRoom(conversationId);
      dispatch(setActiveConversation(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
  useEffect(() => {
    if (shouldAutoScroll.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    const lastMessage = messages?.[messages.length - 1];
    if (lastMessage && lastMessage.sender.id !== currentUserId) {
      emitMarkRead(conversationId, lastMessage.id);
    }
  }, [messages, conversationId, currentUserId]);

  const handleScroll = async () => {
    const el = scrollRef.current;
    if (!el) return;

    shouldAutoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (el.scrollTop < 80 && hasMore && !loadingMore && messages && messages.length > 0) {
      setLoadingMore(true);
      const previousHeight = el.scrollHeight;
      try {
        const older = await getMessages(conversationId, messages[0].id);
        dispatch(
          prependMessages({ conversationId, messages: older, hasMore: older.length === MESSAGE_PAGE_SIZE })
        );
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousHeight;
          }
        });
      } finally {
        setLoadingMore(false);
      }
    }
  };

  if (!conversation) {
    return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading…</div>;
  }

  const isGroup = conversation.type === "GROUP";
  const otherParticipant = !isGroup ? conversation.participants.find((p) => p.id !== currentUserId) : null;
  const headerName = isGroup ? conversation.name ?? "Group" : otherParticipant?.fullName ?? "Unknown";

  const typingNames = (typingUserIds ?? [])
    .map((id) => conversation.participants.find((p) => p.id === id)?.fullName)
    .filter(Boolean);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button onClick={onBack} className="p-1 md:hidden">
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
            {isGroup ? <Users size={16} /> : headerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{headerName}</p>
            <p className="text-xs text-slate-400 truncate">
              {isGroup ? `${conversation.participants.length} members` : otherParticipant?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onStartCall("AUDIO")}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            title="Voice call"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() => onStartCall("VIDEO")}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            title="Video call"
          >
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-3 bg-[#F7F9FB] dark:bg-slate-950"
      >
        {loadingMore && <p className="text-center text-xs text-slate-400 py-2">Loading older messages…</p>}

        {(messages ?? []).map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === currentUserId}
            currentUserId={currentUserId}
            onReply={setReplyingTo}
            onEdit={setEditingMessage}
          />
        ))}
      </div>

      {typingNames.length > 0 && (
        <TypingIndicator
          label={
            typingNames.length === 1
              ? `${typingNames[0]} is typing…`
              : `${typingNames.length} people are typing…`
          }
        />
      )}

      <MessageComposer
        conversationId={conversationId}
        participants={conversation.participants}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </div>
  );
}