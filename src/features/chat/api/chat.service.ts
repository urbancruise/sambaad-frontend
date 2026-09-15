"use client";

import api from "@/src/lib/axios";
import {
  Attachment,
  ChatUser,
  ConversationDetail,
  ConversationSummary,
  Message,
  SearchResult,
} from "../types";

export const getChatDirectory = async (): Promise<ChatUser[]> => {
  const response = await api.get("/chat/directory");
  return response.data.data;
};

export const getConversations = async (): Promise<ConversationSummary[]> => {
  const response = await api.get("/chat/conversations");
  return response.data.data;
};

export const createConversation = async (body: {
  type: "DIRECT" | "GROUP";
  name?: string;
  avatarUrl?: string;
  participantIds: number[];
}): Promise<ConversationDetail> => {
  const response = await api.post("/chat/conversations", body);
  return response.data.data;
};

export const getConversation = async (conversationId: string): Promise<ConversationDetail> => {
  const response = await api.get(`/chat/conversations/${conversationId}`);
  return response.data.data;
};

export const updateConversation = async (
  conversationId: string,
  body: { name?: string; avatarUrl?: string }
): Promise<ConversationDetail> => {
  const response = await api.patch(`/chat/conversations/${conversationId}`, body);
  return response.data.data;
};

export const addParticipants = async (conversationId: string, participantIds: number[]) => {
  const response = await api.post(`/chat/conversations/${conversationId}/participants`, {
    participantIds,
  });
  return response.data.data;
};

export const removeParticipant = async (conversationId: string, userId: number) => {
  const response = await api.delete(`/chat/conversations/${conversationId}/participants/${userId}`);
  return response.data.data;
};

/**
 * History load only. Sending a NEW message goes through the socket
 * (see useChatSocket) so it reaches other participants in realtime —
 * this REST endpoint exists as a fallback if you ever need one
 * (e.g. a retry queue for messages sent while briefly disconnected).
 */
export const getMessages = async (conversationId: string, before?: string): Promise<Message[]> => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
    params: before ? { before } : {},
  });
  return response.data.data;
};

export const uploadChatFile = async (file: File, onProgress?: (pct: number) => void): Promise<Attachment> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/chat/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });

  return response.data.data;
};

export const searchMessages = async (query: string): Promise<SearchResult[]> => {
  const response = await api.get("/chat/search", { params: { q: query } });
  return response.data.data;
};

export const getCallHistory = async (page = 1, limit = 30) => {
  const response = await api.get("/chat/calls/history", { params: { page, limit } });
  return response.data.data;
};