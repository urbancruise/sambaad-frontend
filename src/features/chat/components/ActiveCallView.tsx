"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { CallType } from "../types";
import type { RemotePeer } from "../hooks/useCall";

interface ActiveCallViewProps {
  type: CallType;
  title: string;
  localStream: MediaStream | null;
  peers: Record<number, RemotePeer>;
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

const initials = (name: string) => (name || "?").trim().slice(0, 2).toUpperCase();

/**
 * Plays a remote peer's sound. Always mounted (even on voice calls or
 * when their camera is off) — otherwise nothing ever plays the audio.
 */
function RemoteAudio({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
      ref.current.play().catch(() => {});
    }
  }, [stream]);
  return <audio ref={ref} autoPlay />;
}

/** Video only (muted — sound comes from <RemoteAudio/>). */
function VideoTile({
  stream,
  label,
  mirror = false,
  showVideo,
  className = "",
}: {
  stream: MediaStream | null;
  label: string;
  mirror?: boolean;
  showVideo: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream, showVideo]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center ${className}`}>
      {showVideo ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${mirror ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
          {initials(label)}
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 rounded px-1.5 py-0.5">{label}</span>
    </div>
  );
}

function useCallTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) {
      setSeconds(0);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function ActiveCallView({
  type,
  title,
  localStream,
  peers,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onLeave,
}: ActiveCallViewProps) {
  const peerList = Object.entries(peers);
  const connected = peerList.some(([, p]) => p.stream);
  const timer = useCallTimer(connected);
  const status = connected ? timer : peerList.length > 0 ? "Connecting…" : "Calling…";

  const names = peerList.map(([id, p]) => p.user.fullName || `User ${id}`);
  const heading = title || names.join(", ") || "Call";

  const isVideo = type === "VIDEO";
  const gridCols = peerList.length <= 1 ? "grid-cols-1" : peerList.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col">
      {/* Hidden audio sinks: this is what makes voice calls audible */}
      {peerList.map(([id, peer]) => (
        <RemoteAudio key={`a-${id}`} stream={peer.stream} />
      ))}

      <div className="text-center pt-6 pb-2 text-white">
        <p className="text-base font-semibold truncate px-6">{heading}</p>
        <p className="text-sm text-white/60 mt-0.5">{status}</p>
      </div>

      {isVideo ? (
        <div className="relative flex-1 min-h-0 p-3">
          {peerList.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-300 animate-pulse">
                {initials(heading)}
              </div>
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-2 h-full auto-rows-fr`}>
              {peerList.map(([id, peer]) => (
                <VideoTile
                  key={id}
                  stream={peer.stream}
                  label={peer.user.fullName || `User ${id}`}
                  showVideo={!!peer.stream && peer.stream.getVideoTracks().length > 0}
                />
              ))}
            </div>
          )}

          {/* Self view, small, bottom-right — like WhatsApp */}
          <VideoTile
            stream={localStream}
            label="You"
            mirror
            showVideo={!!localStream && localStream.getVideoTracks().length > 0 && !isVideoOff}
            className="absolute bottom-5 right-5 w-28 h-40 sm:w-36 sm:h-52 shadow-xl border border-white/10"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div
            className={`w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-300 ${
              connected ? "" : "animate-pulse"
            }`}
          >
            {initials(heading)}
          </div>
          {peerList.length > 1 && (
            <p className="text-white/60 text-sm text-center">{names.join(", ")}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 py-6">
        <button
          onClick={onToggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {isVideo && (
          <button
            onClick={onToggleVideo}
            title={isVideoOff ? "Turn camera on" : "Turn camera off"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}

        <button
          onClick={onLeave}
          title="End call"
          className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}