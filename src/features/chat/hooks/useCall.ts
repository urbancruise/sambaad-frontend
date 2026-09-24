"use client";

import { useCallback, useRef, useState } from "react";
import { getSocket } from "@/src/lib/socket";
import { CallType, ChatUser, IncomingCall } from "../types";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:your-turn-host:3478",
    username: "your-username",
    credential: "your-credential",
  },
];

interface RemotePeer {
  user: ChatUser;
  stream: MediaStream | null;
}

interface ActiveCallState {
  callId: string;
  conversationId: string;
  type: CallType;
  peers: Record<number, RemotePeer>;
  startedAt: number;
}

interface DeviceChoice {
  audioDeviceId?: string;
  videoDeviceId?: string;
}

export const useCall = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [pendingOutgoing, setPendingOutgoing] = useState<{ conversationId: string; type: CallType } | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);

  const [callWindow, setCallWindow] = useState<Window | null>(null);
  const [callWindowBlocked, setCallWindowBlocked] = useState(false);

  const peerConnections = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidates = useRef<Map<number, RTCIceCandidateInit[]>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const activeCallRef = useRef<ActiveCallState | null>(null);
  activeCallRef.current = activeCall;

  const callWindowRef = useRef<Window | null>(null);
  const closePollRef = useRef<number | null>(null);
  const intentionalCloseRef = useRef(false);

  const clearCallError = useCallback(() => setCallError(null), []);

  const cleanupPeer = useCallback((userId: number) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
    pendingIceCandidates.current.delete(userId);
  }, []);

  const closeCallWindow = useCallback(() => {
    intentionalCloseRef.current = true;
    if (closePollRef.current) {
      window.clearInterval(closePollRef.current);
      closePollRef.current = null;
    }
    try {
      callWindowRef.current?.close();
    } catch {
      // ignore
    }
    callWindowRef.current = null;
    setCallWindow(null);
    setCallWindowBlocked(false);
  }, []);

  const cleanupCall = useCallback(() => {
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    pendingIceCandidates.current.clear();

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setActiveCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    closeCallWindow();
  }, [closeCallWindow]);

  const getOrCreatePeerConnection = useCallback((remoteUserId: number, remoteUser: ChatUser) => {
    let pc = peerConnections.current.get(remoteUserId);
    if (pc) return pc;

    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    localStreamRef.current?.getTracks().forEach((track) => {
      pc!.addTrack(track, localStreamRef.current!);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && activeCallRef.current) {
        getSocket().emit("webrtc:ice-candidate", {
          callId: activeCallRef.current.callId,
          toUserId: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setActiveCall((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          peers: { ...prev.peers, [remoteUserId]: { user: remoteUser, stream: event.streams[0] } },
        };
      });
    };

    peerConnections.current.set(remoteUserId, pc);
    return pc;
  }, []);

  const acquireLocalMedia = useCallback(async (type: CallType, devices?: DeviceChoice) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: devices?.audioDeviceId ? { deviceId: { exact: devices.audioDeviceId } } : true,
      video:
        type === "VIDEO"
          ? devices?.videoDeviceId
            ? { deviceId: { exact: devices.videoDeviceId } }
            : true
          : false,
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  // ---- Real popup window --------------------------------------------------

  const openCallWindow = useCallback((type: CallType) => {
    const width = type === "VIDEO" ? 480 : 340;
    const height = type === "VIDEO" ? 420 : 240;
    const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - height) / 2);

    const win = window.open(
      "",
      "sambaad-call",
      `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`
    );

    if (!win) {
      setCallWindowBlocked(true);
      return null;
    }

    win.document.title = type === "VIDEO" ? "Video call" : "Voice call";
    win.document.body.style.margin = "0";
    win.document.body.style.background = "#020617";
    win.document.body.style.overflow = "hidden";

    [...document.styleSheets].forEach((sheet) => {
      try {
        const cssRules = [...sheet.cssRules].map((r) => r.cssText).join("");
        const style = win.document.createElement("style");
        style.textContent = cssRules;
        win.document.head.appendChild(style);
      } catch {
        if (sheet.href) {
          const link = win.document.createElement("link");
          link.rel = "stylesheet";
          link.href = sheet.href;
          win.document.head.appendChild(link);
        }
      }
    });

    callWindowRef.current = win;
    intentionalCloseRef.current = false;
    setCallWindow(win);
    setCallWindowBlocked(false);

    closePollRef.current = window.setInterval(() => {
      if (win.closed) {
        if (closePollRef.current) window.clearInterval(closePollRef.current);
        closePollRef.current = null;
        callWindowRef.current = null;
        setCallWindow(null);

        if (!intentionalCloseRef.current) {
          leaveCallInternal();
        }
      }
    }, 500);

    return win;
  }, []);

  /** Brings the popped-out call window back into focus/foreground — used by the "Return to call" button. */
  const focusCallWindow = useCallback(() => {
    try {
      callWindowRef.current?.focus();
    } catch {
      // ignore
    }
  }, []);

  const leaveCallInternal = useCallback(() => {
    const call = activeCallRef.current;
    if (!call) return;
    getSocket().emit("call:leave", { callId: call.callId });
    cleanupCall();
  }, [cleanupCall]);

  // ---- Outgoing / incoming call lifecycle --------------------------------

  const requestOutgoingCall = useCallback((conversationId: string, type: CallType) => {
    setCallError(null);
    setPendingOutgoing({ conversationId, type });
  }, []);

  const cancelOutgoingRequest = useCallback(() => setPendingOutgoing(null), []);

  /**
   * FIX: no longer rejects a Promise that nothing was catching (that
   * was the source of the uncaught error). On failure, it cleans up
   * (closing any popup window already opened) and surfaces a readable
   * message via `callError` instead of throwing into the void.
   */
  const startCall = useCallback(
    async (conversationId: string, type: CallType, devices?: DeviceChoice) => {
      try {
        await acquireLocalMedia(type, devices);
      } catch (err) {
        setPendingOutgoing(null);
        setCallError("Couldn't access your camera/microphone. Check permissions and try again.");
        return;
      }
      setPendingOutgoing(null);

      getSocket().emit(
        "call:initiate",
        { conversationId, type },
        (ack: { ok: boolean; call?: { id: string }; error?: string }) => {
          if (!ack.ok || !ack.call) {
            cleanupCall();
            setCallError(ack.error || "Failed to start call. Please try again.");
            return;
          }
          setActiveCall({ callId: ack.call.id, conversationId, type, peers: {}, startedAt: Date.now() });
        }
      );
    },
    [acquireLocalMedia, cleanupCall]
  );

  const acceptIncomingCall = useCallback(
    async (devices?: DeviceChoice) => {
      if (!incomingCall) return;
      const { callId, conversationId, type } = incomingCall;

      try {
        await acquireLocalMedia(type, devices);
      } catch {
        setIncomingCall(null);
        setCallError("Couldn't access your camera/microphone. Check permissions and try again.");
        return;
      }
      setIncomingCall(null);

      getSocket().emit(
        "call:accept",
        { callId },
        (ack: { ok: boolean; existingParticipants?: ChatUser[]; error?: string }) => {
          if (!ack.ok) {
            cleanupCall();
            setCallError(ack.error || "Failed to join call. Please try again.");
            return;
          }
          setActiveCall({ callId, conversationId, type, peers: {}, startedAt: Date.now() });
        }
      );
    },
    [incomingCall, acquireLocalMedia, cleanupCall]
  );

  const declineIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    getSocket().emit("call:decline", { callId: incomingCall.callId });
    setIncomingCall(null);
  }, [incomingCall]);

  const leaveCall = useCallback(() => {
    leaveCallInternal();
  }, [leaveCallInternal]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !isMuted;
    stream.getAudioTracks().forEach((t) => (t.enabled = !next));
    setIsMuted(next);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !isVideoOff;
    stream.getVideoTracks().forEach((t) => (t.enabled = !next));
    setIsVideoOff(next);
  }, [isVideoOff]);

  // ---- Socket event handlers ------------------------------------------

const registerCallSocketHandlers = useCallback(() => {
  const socket = getSocket();

  // Fires on the very first connect AND every automatic reconnect
  // after a network blip. If we still think we're in a call, tell
  // the server we're back before its grace-period timer (see
  // call.socket.js) decides we actually hung up.
  const onConnect = () => {
    if (activeCallRef.current) {
      socket.emit("call:rejoin", { callId: activeCallRef.current.callId });
    }
  };

  const onIncoming = (payload: IncomingCall) => {
    setIncomingCall(payload);
  };

  const onUserJoined = async ({ userId }: { callId: string; userId: number }) => {
    if (!activeCallRef.current) return;
    const pc = getOrCreatePeerConnection(userId, { id: userId, fullName: "" });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc:offer", { callId: activeCallRef.current.callId, toUserId: userId, sdp: offer });
  };

  const onOffer = async ({ fromUserId, sdp }: { callId: string; fromUserId: number; sdp: RTCSessionDescriptionInit }) => {
    const pc = getOrCreatePeerConnection(fromUserId, { id: fromUserId, fullName: "" });
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));

    const queued = pendingIceCandidates.current.get(fromUserId) ?? [];
    for (const candidate of queued) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    pendingIceCandidates.current.delete(fromUserId);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("webrtc:answer", { callId: activeCallRef.current?.callId, toUserId: fromUserId, sdp: answer });
  };

  const onAnswer = async ({ fromUserId, sdp }: { callId: string; fromUserId: number; sdp: RTCSessionDescriptionInit }) => {
    const pc = peerConnections.current.get(fromUserId);
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));

    const queued = pendingIceCandidates.current.get(fromUserId) ?? [];
    for (const candidate of queued) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    pendingIceCandidates.current.delete(fromUserId);
  };

  const onIceCandidate = async ({ fromUserId, candidate }: { callId: string; fromUserId: number; candidate: RTCIceCandidateInit }) => {
    const pc = peerConnections.current.get(fromUserId);
    if (pc?.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      const queue = pendingIceCandidates.current.get(fromUserId) ?? [];
      queue.push(candidate);
      pendingIceCandidates.current.set(fromUserId, queue);
    }
  };

  const onUserLeft = ({ userId }: { callId: string; userId: number }) => {
    cleanupPeer(userId);

    const current = activeCallRef.current;
    const remainingCount = current
      ? Object.keys(current.peers).filter((id) => Number(id) !== userId).length
      : 0;

    setActiveCall((prev) => {
      if (!prev) return prev;
      const rest = { ...prev.peers };
      delete rest[userId];
      return { ...prev, peers: rest };
    });

    if (remainingCount === 0) {
      leaveCallInternal();
    }
  };

  const onUserDeclined = ({ userId }: { callId: string; userId: number }) => {
    onUserLeft({ callId: "", userId });
  };

  const onCallEnded = () => {
    cleanupCall();
  };

  socket.on("connect", onConnect);
  socket.on("call:incoming", onIncoming);
  socket.on("call:user-joined", onUserJoined);
  socket.on("webrtc:offer", onOffer);
  socket.on("webrtc:answer", onAnswer);
  socket.on("webrtc:ice-candidate", onIceCandidate);
  socket.on("call:user-left", onUserLeft);
  socket.on("call:user-declined", onUserDeclined);
  socket.on("call:ended", onCallEnded);

  return () => {
    socket.off("connect", onConnect);
    socket.off("call:incoming", onIncoming);
    socket.off("call:user-joined", onUserJoined);
    socket.off("webrtc:offer", onOffer);
    socket.off("webrtc:answer", onAnswer);
    socket.off("webrtc:ice-candidate", onIceCandidate);
    socket.off("call:user-left", onUserLeft);
    socket.off("call:user-declined", onUserDeclined);
    socket.off("call:ended", onCallEnded);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [getOrCreatePeerConnection, cleanupPeer, cleanupCall, leaveCallInternal]);

  return {
    incomingCall,
    pendingOutgoing,
    activeCall,
    localStream,
    isMuted,
    isVideoOff,
    callError,
    clearCallError,
    peerConnections: peerConnections.current,
    callWindow,
    callWindowBlocked,
    requestOutgoingCall,
    cancelOutgoingRequest,
    startCall,
    acceptIncomingCall,
    declineIncomingCall,
    leaveCall,
    toggleMute,
    toggleVideo,
    openCallWindow,
    focusCallWindow,
    registerCallSocketHandlers,
  };
};