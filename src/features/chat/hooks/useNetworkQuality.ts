"use client";

import { useEffect, useRef, useState } from "react";

export type NetworkQuality = "good" | "fair" | "poor" | "unknown";

/**
 * Polls WebRTC stats for real call quality (packet loss + jitter),
 * not just navigator.onLine (which only tells you if you're offline,
 * not if the connection is bad). Call this once per active call with
 * all current peer connections.
 */
export const useNetworkQuality = (
  peerConnections: Map<number, RTCPeerConnection>,
  active: boolean
) => {
  const [quality, setQuality] = useState<NetworkQuality>("unknown");
  const lastStats = useRef<Map<number, { lost: number; sent: number; time: number }>>(new Map());

  useEffect(() => {
    if (!active) {
      setQuality("unknown");
      return;
    }

    const interval = setInterval(async () => {
      let worst: NetworkQuality = "good";
      let sawAny = false;

      for (const [userId, pc] of peerConnections.entries()) {
        if (pc.connectionState !== "connected") continue;
        sawAny = true;

        try {
          const stats = await pc.getStats();
          let packetsLost = 0;
          let packetsSent = 0;
          let currentRoundTripTime: number | undefined;

          stats.forEach((report) => {
            if (report.type === "remote-inbound-rtp") {
              packetsLost += report.packetsLost ?? 0;
              if (typeof report.roundTripTime === "number") {
                currentRoundTripTime = report.roundTripTime;
              }
            }
            if (report.type === "outbound-rtp" && report.kind === "video" || report.type === "outbound-rtp" && report.kind === "audio") {
              packetsSent += report.packetsSent ?? 0;
            }
          });

          const prev = lastStats.current.get(userId);
          const now = Date.now();
          let lossRatio = 0;

          if (prev) {
            const deltaLost = packetsLost - prev.lost;
            const deltaSent = packetsSent - prev.sent;
            if (deltaSent > 0) lossRatio = deltaLost / (deltaSent + deltaLost);
          }
          lastStats.current.set(userId, { lost: packetsLost, sent: packetsSent, time: now });

          let peerQuality: NetworkQuality = "good";
          if (lossRatio > 0.1 || (currentRoundTripTime ?? 0) > 0.5) peerQuality = "poor";
          else if (lossRatio > 0.03 || (currentRoundTripTime ?? 0) > 0.25) peerQuality = "fair";

          if (peerQuality === "poor") worst = "poor";
          else if (peerQuality === "fair" && worst !== "poor") worst = "fair";
        } catch {
          // getStats can throw briefly during renegotiation — ignore, next tick will retry
        }
      }

      setQuality(sawAny ? worst : "unknown");
    }, 3000);

    return () => clearInterval(interval);
  }, [peerConnections, active]);

  return quality;
};