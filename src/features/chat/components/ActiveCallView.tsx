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

/**
 * Plays back a remote peer's audio. This is required for AUDIO-only
 * calls — previously the audio-call layout rendered no <video> and no
 * <audio> element at all, so incoming audio had nowhere to play.
 * (Video calls don't need this — the <video> tag already plays audio.)
 */
function AudioSink({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.play().catch(() => {
        // Autoplay can be blocked in rare cases; user interaction
        // already happened (they joined the call), so this is a
        // safety net, not expected to actually fire.
      });
    }
  }, [stream]);

  return <audio ref={ref} autoPlay style={{ display: "none" }} />;
}

/**
 * Renders a single video tile. `hasVideo` is tracked as REACTIVE state
 * driven by the track's own `mute`/`unmute`/`ended` events, instead of
 * being computed once per render from `track.enabled` — that one-shot
 * check could catch the track mid-negotiation (before frames actually
 * started flowing) and then never re-check, which is exactly what was
 * causing "receiver video doesn't show until I toggle my camera": the
 * toggle was forcing an unrelated re-render that happened to re-run
 * the check at a point where it now passed.
 */
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
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const track = stream?.getVideoTracks()[0];
    if (!track || videoDisabled) {
      setHasVideo(false);
      return;
    }

    const update = () => setHasVideo(track.enabled && !track.muted);
    update();

    track.addEventListener("mute", update);
    track.addEventListener("unmute", update);
    track.addEventListener("ended", update);

    return () => {
      track.removeEventListener("mute", update);
      track.removeEventListener("unmute", update);
      track.removeEventListener("ended", update);
    };
  }, [stream, videoDisabled]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

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

function ControlButton({
  active,
  onClick,
  label,
  activeIcon,
  inactiveIcon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        className={`w-13 h-13 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors ${
          active ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {active ? activeIcon : inactiveIcon}
      </button>
      <span className="text-[11px] text-white/60">{label}</span>
    </div>
  );
}

export default function ActiveCallView({
  type,
  localStream,
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

  const [focusedLocal, setFocusedLocal] = useState(false);

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
  const primaryPeerLabel = peerList[0]?.[1]?.user.fullName || "Calling…";
  const isOneOnOne = peerList.length <= 1 && type === "VIDEO";

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col select-none">
      {quality === "poor" && (
        <div className="flex items-center justify-center gap-1.5 bg-amber-500/90 text-white text-xs font-semibold py-1.5">
          <WifiOff size={13} /> Your internet connection seems slow — call quality may drop
        </div>
      )}

      <div className="flex items-center justify-center py-2">
        <span className="text-xs text-white/60 bg-white/10 rounded-full px-3 py-1 font-mono">{timer}</span>
      </div>

      {isOneOnOne ? (
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <VideoSurface
              stream={focusedLocal ? localStream : primaryPeer?.stream ?? null}
              label={focusedLocal ? "You" : primaryPeerLabel}
              muted={focusedLocal}
              mirrored={focusedLocal}
              videoDisabled={focusedLocal ? isVideoOff : false}
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
            />
          </div>
        </div>
      ) : type === "VIDEO" ? (
        <div
          className={`flex-1 grid gap-2 p-4 auto-rows-fr overflow-y-auto ${
            peerList.length <= 3 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          <VideoSurface stream={localStream} label="You" muted mirrored videoDisabled={isVideoOff} />
          {peerList.map(([userId, peer]) => (
            <VideoSurface key={userId} stream={peer.stream} label={peer.user.fullName || `User ${userId}`} />
          ))}
        </div>
      ) : (
        // ---- Professional audio call layout ----
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
          {peerList.length <= 1 ? (
            <>
              <div className="relative flex items-center justify-center">
                {peerList.length === 0 && (
                  <span className="absolute w-28 h-28 rounded-full bg-emerald-500/25 animate-ping" />
                )}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-2xl font-bold text-white ring-4 ring-white/5 shadow-xl">
                  {(primaryPeer?.user.fullName || "?").slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-lg font-semibold">
                  {primaryPeer?.user.fullName || "Calling…"}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {peerList.length === 0 ? "Calling…" : "Connected"}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/60 text-sm">{peerList.length + 1} people on this call</p>
              <div className="flex flex-wrap items-center justify-center gap-5 max-w-sm">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/10">
                    You
                  </div>
                  <span className="text-[11px] text-white/50">You</span>
                </div>
                {peerList.map(([id, p]) => (
                  <div key={id} className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 ring-2 ring-white/10">
                      {(p.user.fullName || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[11px] text-white/50 max-w-[64px] truncate">
                      {p.user.fullName || "User"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Real audio playback — this was completely missing before */}
          {peerList.map(([id, p]) => (
            <AudioSink key={id} stream={p.stream} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-6 py-7">
        <ControlButton
          active={isMuted}
          onClick={onToggleMute}
          label={isMuted ? "Unmute" : "Mute"}
          activeIcon={<MicOff size={20} />}
          inactiveIcon={<Mic size={20} />}
        />

        {type === "VIDEO" && (
          <ControlButton
            active={isVideoOff}
            onClick={onToggleVideo}
            label={isVideoOff ? "Start video" : "Stop video"}
            activeIcon={<VideoOff size={20} />}
            inactiveIcon={<Video size={20} />}
          />
        )}

        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={onLeave}
            className="w-[60px] h-[60px] rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-rose-500/20"
          >
            <PhoneOff size={24} />
          </button>
          <span className="text-[11px] text-white/60">End call</span>
        </div>
      </div>
    </div>
  );
}