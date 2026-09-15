import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationSummary, Message, Reaction } from "../types";

interface ChatState {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, Message[]>;
  hasMoreByConversation: Record<string, boolean>;
  typingByConversation: Record<string, number[]>; // userIds currently typing
  onlineUserIds: number[];
  conversationsLoading: boolean;
  messagesLoading: boolean;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  hasMoreByConversation: {},
  typingByConversation: {},
  onlineUserIds: [],
  conversationsLoading: false,
  messagesLoading: false,
};

const sortByLastMessageAt = (list: ConversationSummary[]) =>
  [...list].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversationsLoading(state, action: PayloadAction<boolean>) {
      state.conversationsLoading = action.payload;
    },

    setMessagesLoading(state, action: PayloadAction<boolean>) {
      state.messagesLoading = action.payload;
    },

    setConversations(state, action: PayloadAction<ConversationSummary[]>) {
      state.conversations = sortByLastMessageAt(action.payload);
    },

    upsertConversation(state, action: PayloadAction<ConversationSummary>) {
      const idx = state.conversations.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state.conversations[idx] = action.payload;
      else state.conversations.push(action.payload);
      state.conversations = sortByLastMessageAt(state.conversations);
    },

    /**
     * Fired on `conversation:updated` — bumps the preview/order without
     * needing a full conversation refetch. Unread count only increments
     * if this isn't the conversation currently open (open = already read).
     */
    applyConversationUpdate(
      state,
      action: PayloadAction<{ conversationId: string; lastMessage: Message; currentUserId: number }>
    ) {
      const { conversationId, lastMessage, currentUserId } = action.payload;
      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      conversation.lastMessage = {
        id: lastMessage.id,
        type: lastMessage.type,
        body: lastMessage.body,
        isDeleted: lastMessage.isDeleted,
        sender: lastMessage.sender,
        createdAt: lastMessage.createdAt,
      };
      conversation.lastMessageAt = lastMessage.createdAt;

      const isActiveConversation = state.activeConversationId === conversationId;
      const isOwnMessage = lastMessage.sender.id === currentUserId;
      if (!isActiveConversation && !isOwnMessage) {
        conversation.unreadCount += 1;
      }

      state.conversations = sortByLastMessageAt(state.conversations);
    },

    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      if (action.payload) {
        const conversation = state.conversations.find((c) => c.id === action.payload);
        if (conversation) conversation.unreadCount = 0;
      }
    },

    setMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[]; hasMore: boolean }>) {
      state.messagesByConversation[action.payload.conversationId] = action.payload.messages;
      state.hasMoreByConversation[action.payload.conversationId] = action.payload.hasMore;
    },

    prependMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[]; hasMore: boolean }>) {
      const existing = state.messagesByConversation[action.payload.conversationId] ?? [];
      state.messagesByConversation[action.payload.conversationId] = [...action.payload.messages, ...existing];
      state.hasMoreByConversation[action.payload.conversationId] = action.payload.hasMore;
    },

    addMessage(state, action: PayloadAction<Message>) {
      const list = state.messagesByConversation[action.payload.conversationId];
      if (list) {
        // Avoid duplicates if the sender's own optimistic-free ack and
        // the room broadcast both land.
        if (!list.some((m) => m.id === action.payload.id)) {
          list.push(action.payload);
        }
      }
    },

    updateMessage(state, action: PayloadAction<Message>) {
      const list = state.messagesByConversation[action.payload.conversationId];
      if (!list) return;
      const idx = list.findIndex((m) => m.id === action.payload.id);
      if (idx >= 0) list[idx] = action.payload;
    },

    markMessageDeleted(state, action: PayloadAction<{ conversationId: string; id: string }>) {
      const list = state.messagesByConversation[action.payload.conversationId];
      if (!list) return;
      const message = list.find((m) => m.id === action.payload.id);
      if (message) {
        message.isDeleted = true;
        message.body = null;
      }
    },

    applyReactionUpdate(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        emoji: string;
        user: { id: number; fullName: string };
        added: boolean;
      }>
    ) {
      const list = state.messagesByConversation[action.payload.conversationId];
      if (!list) return;
      const message = list.find((m) => m.id === action.payload.messageId);
      if (!message) return;

      if (action.payload.added) {
        const exists = message.reactions.some(
          (r) => r.user.id === action.payload.user.id && r.emoji === action.payload.emoji
        );
        if (!exists) {
          message.reactions.push({ emoji: action.payload.emoji, user: action.payload.user as Reaction["user"] });
        }
      } else {
        message.reactions = message.reactions.filter(
          (r) => !(r.user.id === action.payload.user.id && r.emoji === action.payload.emoji)
        );
      }
    },

    setTyping(state, action: PayloadAction<{ conversationId: string; userId: number; isTyping: boolean }>) {
      const { conversationId, userId, isTyping } = action.payload;
      const current = state.typingByConversation[conversationId] ?? [];
      state.typingByConversation[conversationId] = isTyping
        ? [...new Set([...current, userId])]
        : current.filter((id) => id !== userId);
    },

    setMessageReadUpTo(
      state,
      action: PayloadAction<{ conversationId: string; userId: number; messageId: string }>
    ) {
      // Read-receipt display (e.g. per-message double-tick) is derived
      // in the UI layer from this event as needed; nothing to store
      // globally here beyond what components consume directly.
      void state;
      void action;
    },

    setPresence(state, action: PayloadAction<{ userId: number; online: boolean }>) {
      state.onlineUserIds = action.payload.online
        ? [...new Set([...state.onlineUserIds, action.payload.userId])]
        : state.onlineUserIds.filter((id) => id !== action.payload.userId);
    },

    resetChatState() {
      return initialState;
    },
  },
});

export const {
  setConversationsLoading,
  setMessagesLoading,
  setConversations,
  upsertConversation,
  applyConversationUpdate,
  setActiveConversation,
  setMessages,
  prependMessages,
  addMessage,
  updateMessage,
  markMessageDeleted,
  applyReactionUpdate,
  setTyping,
  setMessageReadUpTo,
  setPresence,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;