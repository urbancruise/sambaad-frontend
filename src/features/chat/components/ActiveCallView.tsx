"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, WifiOff } from "lucide-react";
import { CallType, ChatUser } from "../types";
import { useNetworkQuality } from "../hooks/useNetworkQuality";

interface RemotePeer {
  user: ChatUser;
  stream: MediaStream | null;
}

interface ActiveCallViewProps {
  type: CallType;
  localStream: MediaStream | null;
  localVideoVersion: number;
  peers: Record<number, RemotePeer>;
  peerConnections: Map<number, RTCPeerConnection>;
  isMuted: boolean;
  isVideoOff: boolean;
  startedAt: number;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

function useElapsed(startedAt: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function VideoSurface({
  stream,
  label,
  muted,
  mirrored,
  videoDisabled,
}: {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  mirrored?: boolean;
  videoDisabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const hasVideo = !videoDisabled && stream?.getVideoTracks().some((t) => t.enabled);

  return (
    <div className="relative w-full h-full bg-slate-800 flex items-center justify-center overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`w-full h-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-base font-bold text-slate-300">
          {label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-1.5 left-1.5 text-[11px] text-white bg-black/50 rounded px-1.5 py-0.5">
        {label}
      </span>
    </div>
  );
}

export default function ActiveCallView({
  type,
  localStream,
  localVideoVersion,
  peers,
  peerConnections,
  isMuted,
  isVideoOff,
  startedAt,
  onToggleMute,
  onToggleVideo,
  onLeave,
}: ActiveCallViewProps) {
  const timer = useElapsed(startedAt);
  const peerList = Object.entries(peers);
  const quality = useNetworkQuality(peerConnections, true);

  // "focused" = which tile is currently the big one. null = the (only)
  // remote peer / grid layout, "local" = you've swapped yourself to big.
  const [focusedLocal, setFocusedLocal] = useState(false);

  // Draggable small tile position
  const dragRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onDragStart = (e: React.PointerEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      x: Math.max(8, e.clientX - dragOffset.current.x),
      y: Math.max(8, e.clientY - dragOffset.current.y),
    });
  };
  const onDragEnd = () => {
    dragging.current = false;
  };

  const primaryPeer = peerList[0]?.[1] ?? null;
  const primaryPeerLabel = peerList[0]?.[1]?.user.fullName || "Waiting…";

  const isOneOnOne = peerList.length <= 1 && type === "VIDEO";

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col select-none">
      {quality === "poor" && (
        <div className="flex items-center justify-center gap-1.5 bg-amber-500/90 text-white text-xs font-semibold py-1.5">
          <WifiOff size={13} /> Your internet connection seems slow — call quality may drop
        </div>
      )}

      <div className="flex items-center justify-center py-2">
        <span className="text-xs text-white/60 bg-white/10 rounded-full px-3 py-1">{timer}</span>
      </div>

      {/* One-on-one video: big tile + draggable swappable small tile, WhatsApp-style */}
      {isOneOnOne ? (
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <VideoSurface
              stream={focusedLocal ? localStream : primaryPeer?.stream ?? null}
              label={focusedLocal ? "You" : primaryPeerLabel}
              muted={focusedLocal}
              mirrored={focusedLocal}
              videoDisabled={focusedLocal ? isVideoOff : false}
              key={focusedLocal ? "local-big" : "remote-big" + localVideoVersion}
            />
          </div>

          <div
            ref={dragRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onClick={() => setFocusedLocal((v) => !v)}
            style={{ left: pos.x, top: pos.y }}
            className="absolute w-28 h-40 sm:w-32 sm:h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 cursor-grab active:cursor-grabbing touch-none"
          >
            <VideoSurface
              stream={focusedLocal ? primaryPeer?.stream ?? null : localStream}
              label={focusedLocal ? primaryPeerLabel : "You"}
              muted={!focusedLocal}
              mirrored={!focusedLocal}
              videoDisabled={focusedLocal ? false : isVideoOff}
              key={focusedLocal ? "remote-small" : "local-small" + localVideoVersion}
            />
          </div>
        </div>
      ) : type === "VIDEO" ? (
        // Group video call: grid layout (drag-to-swap not needed with 3+ tiles)
        <div
          className={`flex-1 grid gap-2 p-4 auto-rows-fr overflow-y-auto ${
            peerList.length <= 3 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          <VideoSurface stream={localStream} label="You" muted mirrored videoDisabled={isVideoOff} key={"local" + localVideoVersion} />
          {peerList.map(([userId, peer]) => (
            <VideoSurface key={userId} stream={peer.stream} label={peer.user.fullName || `User ${userId}`} />
          ))}
        </div>
      ) : (
        // Audio call
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
            {(peerList[0]?.[1].user.fullName || "?").slice(0, 2).toUpperCase()}
          </div>
          <p className="text-white/70 text-sm">
            {peerList.length + 1} on the call — {peerList.map((p) => p[1].user.fullName).join(", ") || "waiting…"}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 py-6">
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {type === "VIDEO" && (
          <button
            onClick={onToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}

        <button
          onClick={onLeave}
          className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}