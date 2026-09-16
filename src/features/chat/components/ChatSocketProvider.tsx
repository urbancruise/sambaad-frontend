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

/**
 * Mount ONCE, high in the authenticated tree. Opens the shared socket
 * connection, listens for chat + call events app-wide, and renders:
 *  - the device-select modal (mic/camera picker) before joining
 *  - the incoming-call ring modal
 *  - the active-call UI — in a real separate OS window via Document
 *    Picture-in-Picture when the browser supports it (Chrome/Edge),
 *    automatically falling back to an in-page fullscreen overlay
 *    everywhere else (Safari/Firefox).
 */
export default function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useChatSocket();

  const call = useCall();

  // Device-select modal can be triggered by either an outgoing call
  // request or accepting an incoming one — this tracks which.
  const [deviceModalMode, setDeviceModalMode] = useState<null | "outgoing" | "incoming">(null);

  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [pipFailed, setPipFailed] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const unregister = call.registerCallSocketHandlers();
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Open the PiP window the moment a call becomes active; close it the
  // moment the call ends. This is what makes it "open automatically /
  // close automatically" like WhatsApp's popout.
  useEffect(() => {
    if (call.activeCall && !pipWindow && !pipFailed) {
      (async () => {
        const win = await call.openPipWindow(
          call.activeCall!.type === "VIDEO" ? 480 : 340,
          call.activeCall!.type === "VIDEO" ? 360 : 200
        );
        if (win) {
          setPipWindow(win);
        } else {
          setPipFailed(true); // browser doesn't support it — fall back to inline overlay
        }
      })();
    }

    if (!call.activeCall) {
      setPipWindow(null);
      setPipFailed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.activeCall]);

  const startCall = (conversationId: string, type: CallType) => {
    call.requestOutgoingCall(conversationId, type);
    setDeviceModalMode("outgoing");
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

      {deviceModalMode === "outgoing" && call.pendingOutgoing && (
        <DeviceSelectModal
          type={call.pendingOutgoing.type}
          title="Start call"
          onCancel={() => {
            call.cancelOutgoingRequest();
            setDeviceModalMode(null);
          }}
          onJoin={(devices) => {
            call.startCall(call.pendingOutgoing!.conversationId, call.pendingOutgoing!.type, devices);
            setDeviceModalMode(null);
          }}
        />
      )}

      {deviceModalMode === "incoming" && call.incomingCall && (
        <DeviceSelectModal
          type={call.incomingCall.type}
          title="Join call"
          onCancel={() => {
            call.declineIncomingCall();
            setDeviceModalMode(null);
          }}
          onJoin={(devices) => {
            call.acceptIncomingCall(devices);
            setDeviceModalMode(null);
          }}
        />
      )}

      {call.incomingCall && deviceModalMode !== "incoming" && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={() => setDeviceModalMode("incoming")}
          onDecline={call.declineIncomingCall}
        />
      )}

      {/* Render into the real popout window when supported */}
      {call.activeCall && pipWindow && createPortal(activeCallView, pipWindow.document.body)}

      {/* Fallback: in-page overlay when Document PiP isn't supported (Safari/Firefox) */}
      {call.activeCall && !pipWindow && pipFailed && activeCallView}
    </ChatCallContext.Provider>
  );
}