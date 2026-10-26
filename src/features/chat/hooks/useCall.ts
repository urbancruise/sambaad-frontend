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

export interface RemotePeer {
  user: ChatUser;
  stream: MediaStream | null;
}

export interface ActiveCallState {
  callId: string;
  conversationId: string;
  type: CallType;
  /** What to show at the top of the call screen (person or group name). */
  title: string;
  peers: Record<number, RemotePeer>;
}

const MEDIA_ERROR: Record<CallType, string> = {
  AUDIO: "Couldn't access your microphone. Allow microphone access in the browser address bar and try again.",
  VIDEO: "Couldn't access your camera or microphone. Allow access in the browser address bar and try again.",
};

export const useCall = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  // Short message shown to the user ("Call declined", "No answer", errors…)
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const peerConnections = useRef<Map<number, RTCPeerConnection>>(new Map());
  const pendingIceCandidates = useRef<Map<number, RTCIceCandidateInit[]>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // The refs are the source of truth; React state is only a mirror for
  // rendering. Socket events can arrive milliseconds after we accept a
  // call — before React has re-rendered — so reading state (or a ref that
  // only syncs on render) used to drop early offers / ICE candidates.
  const activeCallRef = useRef<ActiveCallState | null>(null);
  const incomingCallRef = useRef<IncomingCall | null>(null);

  const commitActiveCall = useCallback((next: ActiveCallState | null) => {
    activeCallRef.current = next;
    setActiveCall(next);
  }, []);

  const updateActiveCall = useCallback(
    (fn: (prev: ActiveCallState) => ActiveCallState) => {
      const prev = activeCallRef.current;
      if (prev) commitActiveCall(fn(prev));
    },
    [commitActiveCall]
  );

  const commitIncomingCall = useCallback((next: IncomingCall | null) => {
    incomingCallRef.current = next;
    setIncomingCall(next);
  }, []);

  const cleanupPeer = useCallback((userId: number) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
    pendingIceCandidates.current.delete(userId);
  }, []);

  const releaseLocalMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const cleanupCall = useCallback(() => {
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    pendingIceCandidates.current.clear();
    releaseLocalMedia();
    commitActiveCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
  }, [commitActiveCall, releaseLocalMedia]);

  const getOrCreatePeerConnection = useCallback(
    (remoteUserId: number) => {
      const existing = peerConnections.current.get(remoteUserId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      pc.onicecandidate = (event) => {
        const call = activeCallRef.current;
        if (event.candidate && call) {
          getSocket().emit("webrtc:ice-candidate", {
            callId: call.callId,
            toUserId: remoteUserId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        updateActiveCall((prev) => ({
          ...prev,
          peers: {
            ...prev.peers,
            [remoteUserId]: {
              user: prev.peers[remoteUserId]?.user ?? { id: remoteUserId, fullName: "" },
              stream: event.streams[0] ?? null,
            },
          },
        }));
      };

      peerConnections.current.set(remoteUserId, pc);
      return pc;
    },
    [updateActiveCall]
  );

  const acquireLocalMedia = useCallback(
    async (type: CallType) => {
      releaseLocalMedia(); // never leave a previous camera/mic stream running

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Calls need a secure (https) connection and a supported browser.");
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: type === "VIDEO" ? { facingMode: "user" } : false,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch {
        throw new Error(MEDIA_ERROR[type]);
      }
    },
    [releaseLocalMedia]
  );

  // ---- Outgoing / incoming call lifecycle --------------------------------

  const startCall = useCallback(
    async (conversationId: string, type: CallType, title: string) => {
      if (activeCallRef.current || incomingCallRef.current) {
        throw new Error("You're already on a call.");
      }

      await acquireLocalMedia(type);

      return new Promise<void>((resolve, reject) => {
        getSocket().emit(
          "call:initiate",
          { conversationId, type },
          (ack: { ok: boolean; call?: { id: string }; error?: string }) => {
            if (!ack?.ok || !ack.call) {
              cleanupCall();
              reject(new Error(ack?.error || "Failed to start call"));
              return;
            }
            commitActiveCall({ callId: ack.call.id, conversationId, type, title, peers: {} });
            resolve();
          }
        );
      });
    },
    [acquireLocalMedia, cleanupCall, commitActiveCall]
  );

  const acceptIncomingCall = useCallback(async () => {
    const incoming = incomingCallRef.current;
    if (!incoming) return;
    const { callId, conversationId, type } = incoming;

    try {
      await acquireLocalMedia(type);
    } catch (err) {
      // Can't get camera/mic: tell the caller we're not joining and say why.
      getSocket().emit("call:decline", { callId });
      commitIncomingCall(null);
      setCallNotice(err instanceof Error ? err.message : MEDIA_ERROR[type]);
      return;
    }

    commitIncomingCall(null);

    // Mark the call active BEFORE telling the server, so an offer that
    // arrives right after the accept is never dropped.
    commitActiveCall({
      callId,
      conversationId,
      type,
      title: incoming.isGroup ? incoming.conversationName ?? "Group call" : incoming.caller.fullName,
      peers: {},
    });

    getSocket().emit("call:accept", { callId }, (ack: { ok: boolean; error?: string }) => {
      if (!ack?.ok) {
        cleanupCall();
        setCallNotice(ack?.error || "Couldn't join the call.");
      }
    });
  }, [acquireLocalMedia, cleanupCall, commitActiveCall, commitIncomingCall]);

  const declineIncomingCall = useCallback(() => {
    const incoming = incomingCallRef.current;
    if (!incoming) return;
    getSocket().emit("call:decline", { callId: incoming.callId });
    commitIncomingCall(null);
  }, [commitIncomingCall]);

  const leaveCall = useCallback(() => {
    const call = activeCallRef.current;
    if (!call) return;
    getSocket().emit("call:leave", { callId: call.callId });
    cleanupCall();
  }, [cleanupCall]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    setIsMuted((prev) => {
      const next = !prev;
      stream.getAudioTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  }, []);

  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    setIsVideoOff((prev) => {
      const next = !prev;
      stream.getVideoTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  }, []);

  // ---- Socket event handlers ------------------------------------------
  // Call registerCallSocketHandlers() once (see ChatSocketProvider) to
  // wire these into the shared socket connection.

  const registerCallSocketHandlers = useCallback(() => {
    const socket = getSocket();

    const drainQueuedCandidates = async (pc: RTCPeerConnection, userId: number) => {
      const queued = pendingIceCandidates.current.get(userId) ?? [];
      pendingIceCandidates.current.delete(userId);
      for (const candidate of queued) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add queued ICE candidate:", err);
        }
      }
    };

    const onIncoming = (payload: IncomingCall) => {
      // Already on / being rung for another call -> auto-decline (busy).
      if (activeCallRef.current || incomingCallRef.current) {
        socket.emit("call:decline", { callId: payload.callId });
        return;
      }
      commitIncomingCall(payload);
    };

    // An existing participant learns a new user joined — per the mesh
    // convention, WE initiate the offer to them (avoids both sides
    // racing to offer at once).
    const onUserJoined = async ({ userId }: { callId: string; userId: number }) => {
      const call = activeCallRef.current;
      if (!call) return;

      try {
        cleanupPeer(userId); // drop any stale connection from an earlier join
        // Show them as "connecting" right away, before media arrives.
        updateActiveCall((prev) => ({
          ...prev,
          peers: { ...prev.peers, [userId]: prev.peers[userId] ?? { user: { id: userId, fullName: "" }, stream: null } },
        }));

        const pc = getOrCreatePeerConnection(userId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc:offer", { callId: call.callId, toUserId: userId, sdp: offer });
      } catch (err) {
        console.error("Failed to create call offer:", err);
      }
    };

    const onOffer = async ({ fromUserId, sdp }: { callId: string; fromUserId: number; sdp: RTCSessionDescriptionInit }) => {
      const call = activeCallRef.current;
      if (!call) return;

      try {
        updateActiveCall((prev) => ({
          ...prev,
          peers: {
            ...prev.peers,
            [fromUserId]: prev.peers[fromUserId] ?? { user: { id: fromUserId, fullName: "" }, stream: null },
          },
        }));

        const pc = getOrCreatePeerConnection(fromUserId);
        await pc.setRemoteDescription(sdp);
        await drainQueuedCandidates(pc, fromUserId);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc:answer", { callId: call.callId, toUserId: fromUserId, sdp: answer });
      } catch (err) {
        console.error("Failed to answer call offer:", err);
      }
    };

    const onAnswer = async ({ fromUserId, sdp }: { callId: string; fromUserId: number; sdp: RTCSessionDescriptionInit }) => {
      const pc = peerConnections.current.get(fromUserId);
      if (!pc) return;
      try {
        await pc.setRemoteDescription(sdp);
        await drainQueuedCandidates(pc, fromUserId);
      } catch (err) {
        console.error("Failed to apply call answer:", err);
      }
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
        try {
          await pc.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
        }
      } else {
        // Remote description not set yet — hold the candidate until it is.
        const queue = pendingIceCandidates.current.get(fromUserId) ?? [];
        queue.push(candidate);
        pendingIceCandidates.current.set(fromUserId, queue);
      }
    };

    const onUserLeft = ({ userId }: { callId: string; userId: number }) => {
      cleanupPeer(userId);
      updateActiveCall((prev) => {
        const rest = { ...prev.peers };
        delete rest[userId];
        return { ...prev, peers: rest };
      });
    };

    const onCallEnded = ({ callId, status }: { callId: string; status?: string }) => {
      // A still-ringing popup for this call goes away.
      if (incomingCallRef.current?.callId === callId) commitIncomingCall(null);

      const call = activeCallRef.current;
      if (call && call.callId === callId) {
        // The caller waited and nobody ever joined — say why it ended.
        if (Object.keys(call.peers).length === 0) {
          if (status === "DECLINED") setCallNotice("Call declined");
          else if (status === "MISSED") setCallNotice("No answer");
        }
        cleanupCall();
      }
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:user-joined", onUserJoined);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice-candidate", onIceCandidate);
    socket.on("call:user-left", onUserLeft);
    socket.on("call:user-declined", onUserLeft);
    socket.on("call:ended", onCallEnded);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:user-joined", onUserJoined);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice-candidate", onIceCandidate);
      socket.off("call:user-left", onUserLeft);
      socket.off("call:user-declined", onUserLeft);
      socket.off("call:ended", onCallEnded);
    };
  }, [cleanupCall, cleanupPeer, commitIncomingCall, getOrCreatePeerConnection, updateActiveCall]);

  return {
    incomingCall,
    activeCall,
    localStream,
    isMuted,
    isVideoOff,
    callNotice,
    setCallNotice,
    startCall,
    acceptIncomingCall,
    declineIncomingCall,
    leaveCall,
    toggleMute,
    toggleVideo,
    registerCallSocketHandlers,
  };
};