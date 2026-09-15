"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/src/lib/socket";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  addMessage,
  applyConversationUpdate,
  applyReactionUpdate,
  markMessageDeleted,
  setPresence,
  setTyping,
  updateMessage,
} from "../store/chatSlice";
import { Message } from "../types";

/**
 * Mount this ONCE near the root of the authenticated app (see
 * ChatSocketProvider.tsx) — it opens the shared socket connection and
 * wires every chat realtime event into Redux. Individual chat
 * components should just read from the store, not touch the socket
 * directly, except for emitting actions (send, typing, join room —
 * see useChatActions-style calls inside ChatWindow/MessageComposer).
 */
export const useChatSocket = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userIdRef = useRef<number | undefined>(user?.id);
  userIdRef.current = user?.id;

  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const onMessageNew = (message: Message) => {
      dispatch(addMessage(message));
    };

    const onConversationUpdated = (payload: { conversationId: string; lastMessage: Message }) => {
      if (!userIdRef.current) return;
      dispatch(applyConversationUpdate({ ...payload, currentUserId: userIdRef.current }));
    };

    const onTypingUpdate = (payload: { conversationId: string; userId: number; isTyping: boolean }) => {
      if (payload.userId === userIdRef.current) return; // ignore our own echo
      dispatch(setTyping(payload));
    };

    const onMessageUpdated = (message: Message) => {
      dispatch(updateMessage(message));
    };

    const onMessageDeleted = (payload: { conversationId: string; id: string }) => {
      dispatch(markMessageDeleted(payload));
    };

    const onReactionUpdate = (payload: {
      conversationId: string;
      messageId: string;
      emoji: string;
      userId: number;
      added: boolean;
    }) => {
      dispatch(
        applyReactionUpdate({
          conversationId: payload.conversationId,
          messageId: payload.messageId,
          emoji: payload.emoji,
          user: { id: payload.userId, fullName: "" }, // display uses cached participant list; id is what matters for matching
          added: payload.added,
        })
      );
    };

    const onPresenceUpdate = (payload: { userId: number; online: boolean }) => {
      dispatch(setPresence(payload));
    };

    socket.on("message:new", onMessageNew);
    socket.on("conversation:updated", onConversationUpdated);
    socket.on("typing:update", onTypingUpdate);
    socket.on("message:updated", onMessageUpdated);
    socket.on("message:deleted", onMessageDeleted);
    socket.on("reaction:update", onReactionUpdate);
    socket.on("presence:update", onPresenceUpdate);

    return () => {
      socket.off("message:new", onMessageNew);
      socket.off("conversation:updated", onConversationUpdated);
      socket.off("typing:update", onTypingUpdate);
      socket.off("message:updated", onMessageUpdated);
      socket.off("message:deleted", onMessageDeleted);
      socket.off("reaction:update", onReactionUpdate);
      socket.off("presence:update", onPresenceUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, dispatch]);
};

// ---- Emit helpers used by components -------------------------------------
// Thin wrappers so components don't import socket.io-client directly.

export const joinConversationRoom = (conversationId: string) => {
  getSocket().emit("conversation:join", { conversationId });
};

export const leaveConversationRoom = (conversationId: string) => {
  getSocket().emit("conversation:leave", { conversationId });
};

export const emitTyping = (conversationId: string, isTyping: boolean) => {
  getSocket().emit("message:typing", { conversationId, isTyping });
};

export const emitMarkRead = (conversationId: string, messageId: string) => {
  getSocket().emit("message:read", { conversationId, messageId });
};

export const emitToggleReaction = (messageId: string, emoji: string) => {
  getSocket().emit("reaction:toggle", { messageId, emoji });
};

export const emitEditMessage = (messageId: string, body: string) => {
  getSocket().emit("message:edit", { messageId, body });
};

export const emitDeleteMessage = (messageId: string) => {
  getSocket().emit("message:delete", { messageId });
};

export interface SendMessagePayload {
  conversationId: string;
  body?: string;
  type?: string;
  replyToId?: string;
  mentions?: number[];
  attachments?: Message["attachments"];
}

export const emitSendMessage = (
  payload: SendMessagePayload
): Promise<{ ok: boolean; message?: Message; error?: string }> => {
  return new Promise((resolve) => {
    getSocket().emit("message:send", payload, (ack: { ok: boolean; message?: Message; error?: string }) => {
      resolve(ack);
    });
  });
};