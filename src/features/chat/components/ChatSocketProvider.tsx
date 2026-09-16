"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
import { useCall } from "../hooks/useCall";
import IncomingCallModal from "./IncomingCallModal";
import ActiveCallView from "./ActiveCallView";
import DeviceSelectModal from "./DeviceSelectModal";
import { CallType } from "../types";

interface ChatCallContextValue {
  startCall: (conversationId: string, type: CallType) => void;
}

const ChatCallContext = createContext<ChatCallContextValue | null>(null);

export const useChatCall = () => {
  const ctx = useContext(ChatCallContext);
  if (!ctx) throw new Error("useChatCall must be used within ChatSocketProvider");
  return ctx;
};

export default function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useChatSocket();

  const call = useCall();

  // Tracks whether the incoming-call flow has moved past the ring
  // screen into "pick your devices" — separate from call.incomingCall
  // itself so the ring modal and the device picker don't show at once.
  const [showIncomingDevicePicker, setShowIncomingDevicePicker] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const unregister = call.registerCallSocketHandlers();
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // If the caller hangs up / call gets declined elsewhere while we're
  // still picking devices, close that picker too.
  useEffect(() => {
    if (!call.incomingCall) setShowIncomingDevicePicker(false);
  }, [call.incomingCall]);

  const startCall = (conversationId: string, type: CallType) => {
    call.requestOutgoingCall(conversationId, type);
  };

  const activeCallView = call.activeCall && (
    <ActiveCallView
      type={call.activeCall.type}
      localStream={call.localStream}
      localVideoVersion={call.localVideoVersion}
      peers={call.activeCall.peers}
      peerConnections={call.peerConnections}
      isMuted={call.isMuted}
      isVideoOff={call.isVideoOff}
      startedAt={call.activeCall.startedAt}
      onToggleMute={call.toggleMute}
      onToggleVideo={call.toggleVideo}
      onLeave={call.leaveCall}
    />
  );

  return (
    <ChatCallContext.Provider value={{ startCall }}>
      {children}

      {/* Outgoing: pick devices, then open the real popup + dial — all synchronous within this click */}
      {call.pendingOutgoing && (
        <DeviceSelectModal
          type={call.pendingOutgoing.type}
          title="Start call"
          onCancel={call.cancelOutgoingRequest}
          onJoin={(devices) => {
            call.openCallWindow(call.pendingOutgoing!.type);
            call.startCall(call.pendingOutgoing!.conversationId, call.pendingOutgoing!.type, devices);
          }}
        />
      )}

      {/* Incoming: ring first */}
      {call.incomingCall && !showIncomingDevicePicker && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={() => setShowIncomingDevicePicker(true)}
          onDecline={call.declineIncomingCall}
        />
      )}

      {/* Incoming: then pick devices, then open the real popup + accept — same synchronous rule */}
      {call.incomingCall && showIncomingDevicePicker && (
        <DeviceSelectModal
          type={call.incomingCall.type}
          title="Join call"
          onCancel={() => {
            call.declineIncomingCall();
            setShowIncomingDevicePicker(false);
          }}
          onJoin={(devices) => {
            call.openCallWindow(call.incomingCall!.type);
            call.acceptIncomingCall(devices);
            setShowIncomingDevicePicker(false);
          }}
        />
      )}

      {/* Real popup window — native minimize/maximize/resize, no "back to tab" trap */}
      {call.activeCall && call.callWindow && createPortal(activeCallView, call.callWindow.document.body)}

      {/* Fallback if the browser's popup blocker prevented the window from opening */}
      {call.activeCall && !call.callWindow && call.callWindowBlocked && activeCallView}
    </ChatCallContext.Provider>
  );
}