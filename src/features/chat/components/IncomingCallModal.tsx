"use client";

import React from "react";
import { Phone, PhoneOff, Video } from "lucide-react";
import { IncomingCall } from "../types";

interface IncomingCallModalProps {
  call: IncomingCall;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallModal({ call, onAccept, onDecline }: IncomingCallModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300 mb-4 animate-pulse">
          {call.caller.fullName.slice(0, 2).toUpperCase()}
        </div>

        <p className="text-lg font-bold text-slate-900 dark:text-white">{call.caller.fullName}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1.5">
          {call.type === "VIDEO" ? <Video size={14} /> : <Phone size={14} />}
          Incoming {call.type === "VIDEO" ? "video" : "voice"} call…
        </p>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={onDecline}
            className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
            title="Decline"
          >
            <PhoneOff size={22} />
          </button>
          <button
            onClick={onAccept}
            className="w-14 h-14 rounded-full bg-[#03C35E] hover:bg-[#02a850] text-white flex items-center justify-center transition-colors"
            title="Accept"
          >
            <Phone size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}