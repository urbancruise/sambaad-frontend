"use client";

import { useCallback, useRef, useState } from "react";
import { getSocket } from "@/src/lib/socket";
import { CallType, ChatUser, IncomingCall } from "../types";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  // TODO: add a TURN server here (self-hosted coturn or a hosted
  // provider). STUN-only will silently fail to connect for some
  // users behind corporate NATs/firewalls — this is very likely
  // part of the "sometimes it just doesn't connect" reports.
  // { urls: "turn:your-turn-server:3478", username: "...", credential: "..." },
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
  startedAt: number; // Date.now() when WE joined/started
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
  const [localVideoVersion, setLocalVideoVersion] = useState(0); // bump to force tile re-check

  const peerConnections = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidates = useRef<Map<number, RTCIceCandidateInit[]>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const activeCallRef = useRef<ActiveCallState | null>(null);
  activeCallRef.current = activeCall;

  const pipWindowRef = useRef<Window | null>(null);

  const cleanupPeer = useCallback((userId: number) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
    pendingIceCandidates.current.delete(userId);
  }, []);

  const closePipWindow = useCallback(() => {
    try {
      pipWindowRef.current?.close();
    } catch {
      // ignore
    }
    pipWindowRef.current = null;
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
    closePipWindow();
  }, [closePipWindow]);

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

  // ---- Popup / Document Picture-in-Picture -------------------------------

  /**
   * Tries to open a real separate OS window (Chrome/Edge's Document
   * Picture-in-Picture API — same mechanism Google Meet uses). Returns
   * the window if it succeeded, or null. Callers should render
   * ActiveCallView into this window's document when non-null, and
   * fall back to an in-page floating overlay when null (Safari/
   * Firefox, or the request failed).
   */
  const openPipWindow = useCallback(async (width = 420, height = 320) => {
    // @ts-expect-error - experimental API, not in TS lib yet
    if (!window.documentPictureInPicture) return null;
    try {
      // @ts-expect-error - experimental API
      const pipWindow: Window = await window.documentPictureInPicture.requestWindow({ width, height });
      pipWindowRef.current = pipWindow;

      // Copy stylesheets so Tailwind classes render correctly inside the popup
      [...document.styleSheets].forEach((sheet) => {
        try {
          const cssRules = [...sheet.cssRules].map((r) => r.cssText).join("");
          const style = document.createElement("style");
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch {
          // Cross-origin stylesheets can't be read — skip them
          if (sheet.href) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = sheet.href;
            pipWindow.document.head.appendChild(link);
          }
        }
      });

      pipWindow.addEventListener("pagehide", () => {
        // User closed the popup window directly — end the call same as hangup
        pipWindowRef.current = null;
        leaveCallInternal();
      });

      return pipWindow;
    } catch {
      return null;
    }
  }, []);

  // declared after so it can be referenced inside openPipWindow's listener
  const leaveCallInternal = useCallback(() => {
    const call = activeCallRef.current;
    if (!call) return;
    getSocket().emit("call:leave", { callId: call.callId }); // backend computes duration itself from call.startedAt
    cleanupCall();
  }, [cleanupCall]);

  // ---- Outgoing / incoming call lifecycle --------------------------------

  const requestOutgoingCall = useCallback((conversationId: string, type: CallType) => {
    // Step 1: just opens the device-select modal; the actual call starts in startCall()
    setPendingOutgoing({ conversationId, type });
  }, []);

  const cancelOutgoingRequest = useCallback(() => setPendingOutgoing(null), []);

  const startCall = useCallback(
    async (conversationId: string, type: CallType, devices?: DeviceChoice) => {
      await acquireLocalMedia(type, devices);
      setPendingOutgoing(null);

      return new Promise<void>((resolve, reject) => {
        getSocket().emit(
          "call:initiate",
          { conversationId, type },
          (ack: { ok: boolean; call?: { id: string }; error?: string }) => {
            if (!ack.ok || !ack.call) {
              cleanupCall();
              reject(new Error(ack.error || "Failed to start call"));
              return;
            }
            setActiveCall({ callId: ack.call.id, conversationId, type, peers: {}, startedAt: Date.now() });
            resolve();
          }
        );
      });
    },
    [acquireLocalMedia, cleanupCall]
  );

  const acceptIncomingCall = useCallback(
    async (devices?: DeviceChoice) => {
      if (!incomingCall) return;
      const { callId, conversationId, type } = incomingCall;

      await acquireLocalMedia(type, devices);
      setIncomingCall(null);

      getSocket().emit(
        "call:accept",
        { callId },
        (ack: { ok: boolean; existingParticipants?: ChatUser[]; error?: string }) => {
          if (!ack.ok) {
            cleanupCall();
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
    setLocalVideoVersion((v) => v + 1); // force the tile to re-check track.enabled
  }, [isVideoOff]);

  // ---- Socket event handlers ------------------------------------------

  const registerCallSocketHandlers = useCallback(() => {
    const socket = getSocket();

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
      setActiveCall((prev) => {
        if (!prev) return prev;
        const rest = { ...prev.peers };
        delete rest[userId];
        return { ...prev, peers: rest };
      });
    };

    const onUserDeclined = ({ userId }: { callId: string; userId: number }) => {
      onUserLeft({ callId: "", userId });
    };

    const onCallEnded = () => {
      cleanupCall();
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:user-joined", onUserJoined);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice-candidate", onIceCandidate);
    socket.on("call:user-left", onUserLeft);
    socket.on("call:user-declined", onUserDeclined);
    socket.on("call:ended", onCallEnded);

    return () => {
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
  }, [getOrCreatePeerConnection, cleanupPeer, cleanupCall]);

  return {
    incomingCall,
    pendingOutgoing,
    activeCall,
    localStream,
    isMuted,
    isVideoOff,
    localVideoVersion,
    peerConnections: peerConnections.current,
    requestOutgoingCall,
    cancelOutgoingRequest,
    startCall,
    acceptIncomingCall,
    declineIncomingCall,
    leaveCall,
    toggleMute,
    toggleVideo,
    openPipWindow,
    registerCallSocketHandlers,
  };
};