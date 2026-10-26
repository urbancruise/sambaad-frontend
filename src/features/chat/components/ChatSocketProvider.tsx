"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { RootState } from "@/src/lib/store";
import { useChatSocket } from "../hooks/useChatSocket";
import { useCall } from "../hooks/useCall";
import IncomingCallModal from "./IncomingCallModal";
import ActiveCallView from "./ActiveCallView";
import { CallType, ConversationSummary } from "../types";

interface ChatCallContextValue {
  startCall: (conversationId: string, type: CallType, title: string) => Promise<void>;
}

const ChatCallContext = createContext<ChatCallContextValue | null>(null);

export const useChatCall = () => {
  const ctx = useContext(ChatCallContext);
  if (!ctx) throw new Error("useChatCall must be used within ChatSocketProvider");
  return ctx;
};

/**
 * Mount ONCE, high in the authenticated tree. Opens the shared socket,
 * listens for chat + call events for the whole app (so an incoming call
 * rings even off the chat screen) and renders the call overlays.
 */
export default function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useChatSocket();

  const call = useCall();
  const { registerCallSocketHandlers, setCallNotice, callNotice } = call;

  const conversations = useSelector((s: RootState) => s.chat.conversations) as ConversationSummary[];

  useEffect(() => {
    if (!user?.id) return;
    return registerCallSocketHandlers();
  }, [user?.id, registerCallSocketHandlers]);

  // Auto-hide the small notice ("Call declined", errors…)
  useEffect(() => {
    if (!callNotice) return;
    const t = setTimeout(() => setCallNotice(null), 4000);
    return () => clearTimeout(t);
  }, [callNotice, setCallNotice]);

  const startCall = useCallback(
    async (conversationId: string, type: CallType, title: string) => {
      try {
        setCallNotice(null);
        await call.startCall(conversationId, type, title);
      } catch (err) {
        setCallNotice(err instanceof Error ? err.message : "Couldn't start the call.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [call.startCall, setCallNotice]
  );

  // Fill in peer names from the conversation's participant list (the
  // WebRTC events only carry user ids).
  const peers = useMemo(() => {
    if (!call.activeCall) return {};
    const people = conversations.find((c) => c.id === call.activeCall!.conversationId)?.participants ?? [];
    const out: typeof call.activeCall.peers = {};
    for (const [id, peer] of Object.entries(call.activeCall.peers)) {
      const known = people.find((p) => p.id === Number(id));
      out[Number(id)] = { ...peer, user: known ?? peer.user };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.activeCall, conversations]);

  return (
    <ChatCallContext.Provider value={{ startCall }}>
      {children}

      {call.incomingCall && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={call.acceptIncomingCall}
          onDecline={call.declineIncomingCall}
        />
      )}

      {call.activeCall && (
        <ActiveCallView
          type={call.activeCall.type}
          title={call.activeCall.title}
          localStream={call.localStream}
          peers={peers}
          isMuted={call.isMuted}
          isVideoOff={call.isVideoOff}
          onToggleMute={call.toggleMute}
          onToggleVideo={call.toggleVideo}
          onLeave={call.leaveCall}
        />
      )}

      {callNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] max-w-sm bg-slate-900 text-white text-sm rounded-lg px-4 py-2.5 shadow-xl">
          {callNotice}
        </div>
      )}
    </ChatCallContext.Provider>
  );
}