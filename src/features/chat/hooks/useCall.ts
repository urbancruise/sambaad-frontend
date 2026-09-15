"use client";

import { useCallback, useRef, useState } from "react";
import { getSocket } from "@/src/lib/socket";
import { CallType, ChatUser, IncomingCall } from "../types";

/**
 * NOTE on reliability: this uses only a public STUN server. STUN is
 * enough for most home/office networks, but some corporate firewalls
 * and symmetric NATs will silently fail to connect without a TURN
 * server. If calls work for some users but not others, that's almost
 * certainly it — add a TURN server (e.g. self-hosted coturn, or a
 * hosted provider) to the iceServers list below when you hit that.
 */
const ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

interface RemotePeer {
  user: ChatUser;
  stream: MediaStream | null;
}

interface ActiveCallState {
  callId: string;
  conversationId: string;
  type: CallType;
  peers: Record<number, RemotePeer>;
}

export const useCall = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const peerConnections = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidates = useRef<Map<number, RTCIceCandidateInit[]>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Kept in a ref too, so socket callbacks registered once always see
  // the latest activeCall without needing to be re-registered.
  const activeCallRef = useRef<ActiveCallState | null>(null);
  activeCallRef.current = activeCall;

  const cleanupPeer = useCallback((userId: number) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
    pendingIceCandidates.current.delete(userId);
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
  }, []);

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

  const acquireLocalMedia = useCallback(async (type: CallType) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "VIDEO",
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  // ---- Outgoing / incoming call lifecycle --------------------------------

  const startCall = useCallback(
    async (conversationId: string, type: CallType) => {
      await acquireLocalMedia(type);

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
            setActiveCall({ callId: ack.call.id, conversationId, type, peers: {} });
            resolve();
          }
        );
      });
    },
    [acquireLocalMedia, cleanupCall]
  );

  const acceptIncomingCall = useCallback(async () => {
    if (!incomingCall) return;
    const { callId, conversationId, type } = incomingCall;

    await acquireLocalMedia(type);
    setIncomingCall(null);

    getSocket().emit(
      "call:accept",
      { callId },
      (ack: { ok: boolean; existingParticipants?: ChatUser[]; error?: string }) => {
        if (!ack.ok) {
          cleanupCall();
          return;
        }
        setActiveCall({ callId, conversationId, type, peers: {} });
        // Per the mesh convention, existing participants send US the
        // offer next — we just wait for `webrtc:offer` and answer it.
      }
    );
  }, [incomingCall, acquireLocalMedia, cleanupCall]);

  const declineIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    getSocket().emit("call:decline", { callId: incomingCall.callId });
    setIncomingCall(null);
  }, [incomingCall]);

  const leaveCall = useCallback(() => {
    if (!activeCall) return;
    getSocket().emit("call:leave", { callId: activeCall.callId });
    cleanupCall();
  }, [activeCall, cleanupCall]);

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
  // Call registerCallSocketHandlers() once (see ChatSocketProvider) to
  // wire these into the shared socket connection.

  const registerCallSocketHandlers = useCallback(() => {
    const socket = getSocket();

    const onIncoming = (payload: IncomingCall) => {
      setIncomingCall(payload);
    };

    // An existing participant learns a new user joined — per the mesh
    // convention, WE initiate the offer to them (avoids both sides
    // racing to offer at once).
    const onUserJoined = async ({ userId }: { callId: string; userId: number }) => {
      if (!activeCallRef.current) return;
      const pc = getOrCreatePeerConnection(userId, { id: userId, fullName: "" });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc:offer", { callId: activeCallRef.current.callId, toUserId: userId, sdp: offer });
    };

    const onOffer = async ({
      fromUserId,
      sdp,
    }: {
      callId: string;
      fromUserId: number;
      sdp: RTCSessionDescriptionInit;
    }) => {
      const pc = getOrCreatePeerConnection(fromUserId, { id: fromUserId, fullName: "" });
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      const queued = pendingIceCandidates.current.get(fromUserId) ?? [];
      for (const candidate of queued) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      pendingIceCandidates.current.delete(fromUserId);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc:answer", { callId: activeCallRef.current?.callId, toUserId: fromUserId, sdp: answer });
    };

    const onAnswer = async ({
      fromUserId,
      sdp,
    }: {
      callId: string;
      fromUserId: number;
      sdp: RTCSessionDescriptionInit;
    }) => {
      const pc = peerConnections.current.get(fromUserId);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      const queued = pendingIceCandidates.current.get(fromUserId) ?? [];
      for (const candidate of queued) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      pendingIceCandidates.current.delete(fromUserId);
    };

    const onIceCandidate = async ({
      fromUserId,
      candidate,
    }: {
      callId: string;
      fromUserId: number;
      candidate: RTCIceCandidateInit;
    }) => {
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
    activeCall,
    localStream,
    isMuted,
    isVideoOff,
    startCall,
    acceptIncomingCall,
    declineIncomingCall,
    leaveCall,
    toggleMute,
    toggleVideo,
    registerCallSocketHandlers,
  };
};