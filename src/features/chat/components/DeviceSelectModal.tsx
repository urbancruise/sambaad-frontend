"use client";

import React, { useEffect, useState } from "react";
import { Mic, Video, Phone, X } from "lucide-react";
import { CallType } from "../types";

interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

interface DeviceSelectModalProps {
  type: CallType;
  onJoin: (opts: { audioDeviceId?: string; videoDeviceId?: string }) => void;
  onCancel: () => void;
  title?: string;
}

export default function DeviceSelectModal({ type, onJoin, onCancel, title }: DeviceSelectModalProps) {
  const [mics, setMics] = useState<MediaDeviceOption[]>([]);
  const [cams, setCams] = useState<MediaDeviceOption[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedCam, setSelectedCam] = useState<string>("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    (async () => {
      try {
        // Requesting a stream first is required in most browsers before
        // enumerateDevices() returns real labels instead of blank ones.
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "VIDEO",
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }));
        const videoInputs = devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" }));

        setMics(audioInputs);
        setCams(videoInputs);
        setSelectedMic(audioInputs[0]?.deviceId ?? "");
        setSelectedCam(videoInputs[0]?.deviceId ?? "");
        setPreviewStream(stream);
      } catch (err) {
        setPermissionError(
          "Camera/microphone access was blocked. Please allow permissions in your browser and try again."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Re-preview whenever the selected camera changes
  useEffect(() => {
    if (!selectedCam || type !== "VIDEO") return;
    let cancelled = false;
    let stream: MediaStream | null = null;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { deviceId: { exact: selectedCam } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setPreviewStream((prev) => {
          prev?.getVideoTracks().forEach((t) => t.stop());
          return stream;
        });
      } catch {
        // keep previous preview if switching fails
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCam, type]);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const handleJoin = () => {
    previewStream?.getTracks().forEach((t) => t.stop());
    onJoin({ audioDeviceId: selectedMic || undefined, videoDeviceId: selectedCam || undefined });
  };

  const handleCancel = () => {
    previewStream?.getTracks().forEach((t) => t.stop());
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {title ?? (type === "VIDEO" ? "Check your camera & mic" : "Check your microphone")}
          </h3>
          <button onClick={handleCancel} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>

        {permissionError ? (
          <p className="text-sm text-rose-500">{permissionError}</p>
        ) : (
          <>
            {type === "VIDEO" && (
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video mb-4 flex items-center justify-center">
                {loading ? (
                  <span className="text-xs text-slate-400">Starting preview…</span>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                )}
              </div>
            )}

            <div className="space-y-3">
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <Mic size={13} /> Microphone
                </span>
                <select
                  value={selectedMic}
                  onChange={(e) => setSelectedMic(e.target.value)}
                  disabled={loading || mics.length === 0}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-sm"
                >
                  {mics.map((m) => (
                    <option key={m.deviceId} value={m.deviceId}>{m.label}</option>
                  ))}
                </select>
              </label>

              {type === "VIDEO" && (
                <label className="block">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Video size={13} /> Camera
                  </span>
                  <select
                    value={selectedCam}
                    onChange={(e) => setSelectedCam(e.target.value)}
                    disabled={loading || cams.length === 0}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-sm"
                  >
                    {cams.map((c) => (
                      <option key={c.deviceId} value={c.deviceId}>{c.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading || !!permissionError}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#03C35E] hover:bg-[#02a850] rounded-lg disabled:opacity-50"
          >
            <Phone size={14} /> Join call
          </button>
        </div>
      </div>
    </div>
  );
}