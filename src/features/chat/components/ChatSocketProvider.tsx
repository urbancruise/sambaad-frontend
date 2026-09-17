"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PhoneCall, X } from "lucide-react";
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

function useElapsedLabel(startedAt: number) {
  const [label, setLabel] = useState("00:00");
  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const ss = String(elapsed % 60).padStart(2, "0");
      setLabel(`${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return label;
}

export default function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  useChatSocket();

  const call = useCall();
  const [showIncomingDevicePicker, setShowIncomingDevicePicker] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const unregister = call.registerCallSocketHandlers();
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!call.incomingCall) setShowIncomingDevicePicker(false);
  }, [call.incomingCall]);

  // Auto-dismiss error toast
  useEffect(() => {
    if (!call.callError) return;
    const id = setTimeout(call.clearCallError, 6000);
    return () => clearTimeout(id);
  }, [call.callError, call.clearCallError]);

  const startCall = (conversationId: string, type: CallType) => {
    call.requestOutgoingCall(conversationId, type);
  };

  const activeCallView = call.activeCall && (
    <ActiveCallView
      type={call.activeCall.type}
      localStream={call.localStream}
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

      {call.incomingCall && !showIncomingDevicePicker && (
        <IncomingCallModal
          call={call.incomingCall}
          onAccept={() => setShowIncomingDevicePicker(true)}
          onDecline={call.declineIncomingCall}
        />
      )}

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

      {call.activeCall && call.callWindow && createPortal(activeCallView, call.callWindow.document.body)}
      {call.activeCall && !call.callWindow && call.callWindowBlocked && activeCallView}

      {/* "Return to call" bar — shows in the main app window whenever the
          call has been popped out, so the user can get back to it even
          if they minimized/lost track of the popup window. */}
      {call.activeCall && call.callWindow && <ReturnToCallBar startedAt={call.activeCall.startedAt} onReturn={call.focusCallWindow} />}

      {/* Error toast — this is what was previously an invisible, uncaught
          console error with no user-facing feedback at all. */}
      {call.callError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 bg-rose-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg max-w-sm">
          <span className="flex-1">{call.callError}</span>
          <button onClick={call.clearCallError} className="p-0.5 hover:bg-white/20 rounded">
            <X size={14} />
          </button>
        </div>
      )}
    </ChatCallContext.Provider>
  );
}

function ReturnToCallBar({ startedAt, onReturn }: { startedAt: number; onReturn: () => void }) {
  const label = useElapsedLabel(startedAt);
  return (
    <button
      onClick={onReturn}
      className="fixed bottom-5 right-5 z-[85] flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-colors"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      <PhoneCall size={15} />
      In call · {label}
      <span className="text-white/70 font-normal">Return</span>
    </button>
  );
}