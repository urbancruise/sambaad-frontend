"use client";

import { useEffect, useRef } from "react";

/**
 * Plays a simple two-tone ring (repeating) for as long as `active` is
 * true. Synthesized via Web Audio — no external audio file needed.
 *
 * Note: browsers block audio from starting without a prior user
 * gesture on the page. Since the person is already logged in and has
 * been clicking around the app, this is almost always already
 * satisfied by the time a call comes in — but if you ever see it stay
 * silent on a freshly-loaded tab, that's the browser's autoplay
 * policy, not a bug here.
 */
export function useRingtone(active: boolean) {
  const stoppedRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      stoppedRef.current = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      return;
    }

    stoppedRef.current = false;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new AudioCtxClass();
    audioCtxRef.current = ctx;
    ctx.resume().catch(() => {});

    const ringOnce = () => {
      if (stoppedRef.current) return;
      const now = ctx.currentTime;

      [0, 0.4].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.15, now + offset + 0.02);
        gain.gain.linearRampToValueAtTime(0, now + offset + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.35);
      });

      timeoutRef.current = window.setTimeout(ringOnce, 2000);
    };

    ringOnce();

    return () => {
      stoppedRef.current = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      ctx.close().catch(() => {});
    };
  }, [active]);
}