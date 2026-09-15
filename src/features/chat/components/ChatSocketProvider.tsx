"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
import { useCall } from "../hooks/useCall";
import IncomingCallModal from "./IncomingCallModal";
import ActiveCallView from "./ActiveCallView";
import { CallType } from "../types";

interface ChatCallContextValue {
  startCall: (conversationId: string, type: CallType) => Promise<void>;
}

const ChatCallContext = createContext<ChatCallContextValue | null>(null);

export const useChatCall = () => {
  const ctx = useContext(ChatCallContext);
  if (!ctx) throw new Error("useChatCall must be used within ChatSocketProvider");
  return ctx;
};

/**
 * Mount ONCE, high in the authenticated tree — see the (dashboard)
 * layout.tsx wiring. Opens the shared socket connection, listens for
 * chat + call events for the whole app (so an incoming call rings
 * even if the user isn't on the chat screen), and renders the
 * incoming-call / active-call overlays above everything else.
 *
 * TODO (follow-up, once we revisit server.js/Email.socket.js):
 * Email.socket.js currently creates its OWN `new Server(...)` rather
 * than sharing one `io` instance. Once that's consolidated server-side,
 * consider merging useEmailSocket's connection logic with getSocket()
 * here too, so the frontend also has just one socket connection
 * instead of two separate ones talking to the same backend.
 */
export default function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useChatSocket();

  const call = useCall();

  useEffect(() => {
    if (!user?.id) return;
    const unregister = call.registerCallSocketHandlers();
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const startCall = async (conversationId: string, type: CallType) => {
    await call.startCall(conversationId, type);
  };

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
          localStream={call.localStream}
          peers={call.activeCall.peers}
          isMuted={call.isMuted}
          isVideoOff={call.isVideoOff}
          onToggleMute={call.toggleMute}
          onToggleVideo={call.toggleVideo}
          onLeave={call.leaveCall}
        />
      )}
    </ChatCallContext.Provider>
  );
}