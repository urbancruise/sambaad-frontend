export type ConversationType = "DIRECT" | "GROUP";
export type ParticipantRole = "OWNER" | "ADMIN" | "MEMBER";
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO" | "SYSTEM" | "CALL_LOG";
export type CallType = "AUDIO" | "VIDEO";
export type CallParticipantStatus = "INVITED" | "RINGING" | "JOINED" | "DECLINED" | "LEFT" | "MISSED";

export interface ChatUser {
  id: number;
  fullName: string;
  email?: string;
  username?: string;
}

export interface Participant extends ChatUser {
  role: ParticipantRole;
  isMuted: boolean;
}

export interface Attachment {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
}

export interface ReplyPreview {
  id: string;
  body: string | null;
  isDeleted: boolean;
  sender: ChatUser;
  attachments: Attachment[];
}

export interface Reaction {
  emoji: string;
  user: ChatUser;
}

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  body: string | null;
  isDeleted: boolean;
  isEdited: boolean;
  editedAt?: string | null;
  sender: ChatUser;
  replyTo: ReplyPreview | null;
  mentions: number[];
  attachments: Attachment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface LastMessagePreview {
  id: string;
  type: MessageType;
  body: string | null;
  isDeleted: boolean;
  sender: ChatUser;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  type: ConversationType;
  name: string | null;
  avatarUrl: string | null;
  participants: Participant[];
  lastMessage: LastMessagePreview | null;
  unreadCount: number;
  lastMessageAt: string;
}

export interface ConversationDetail {
  id: string;
  type: ConversationType;
  name: string | null;
  avatarUrl: string | null;
  participants: Participant[];
  createdAt: string;
}

export interface CallParticipantInfo extends ChatUser {
  status: CallParticipantStatus;
}

export interface IncomingCall {
  callId: string;
  conversationId: string;
  type: CallType;
  caller: ChatUser;
}

export interface SearchResult {
  id: string;
  conversationId: string;
  conversationName: string | null;
  conversationType: ConversationType;
  body: string | null;
  sender: ChatUser;
  createdAt: string;
}