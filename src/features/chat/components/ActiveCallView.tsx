"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { CallType, ChatUser } from "../types";

interface RemotePeer {
  user: ChatUser;
  stream: MediaStream | null;
}

interface ActiveCallViewProps {
  type: CallType;
  localStream: MediaStream | null;
  peers: Record<number, RemotePeer>;
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

function VideoTile({ stream, label, muted = false }: { stream: MediaStream | null; label: string; muted?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideoTrack = stream?.getVideoTracks().some((t) => t.enabled);

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center">
      {stream && hasVideoTrack ? (
        <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
          {label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 rounded px-1.5 py-0.5">
        {label}
      </span>
    </div>
  );
}

export default function ActiveCallView({
  type,
  localStream,
  peers,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onLeave,
}: ActiveCallViewProps) {
  const peerList = Object.entries(peers);
  const gridCols = peerList.length <= 1 ? "grid-cols-1" : peerList.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col">
      <div className={`flex-1 grid ${gridCols} gap-2 p-4 auto-rows-fr overflow-y-auto`}>
        {type === "VIDEO" && <VideoTile stream={localStream} label="You" muted />}
        {peerList.map(([userId, peer]) => (
          <VideoTile key={userId} stream={peer.stream} label={peer.user.fullName || `User ${userId}`} />
        ))}
      </div>

      {type === "AUDIO" && (
        <div className="flex-1 flex items-center justify-center">
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