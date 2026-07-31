"use client";

import {
    Calendar,
    Flag,
    CheckCircle2,
    Target,
} from "lucide-react";

import { CalendarEvent } from "../types";

interface Props {
    event: CalendarEvent;
}

export default function EventTooltip({
    event,
}: Props) {
    return (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                    {event.title}
                </h3>
                <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{
                        background: event.color,
                    }}
                >
                    {event.type}
                </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Calendar size={15} />
                    {new Date(event.startDate).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                    <Flag size={15} />
                    {event.priority}
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    {event.status}
                </div>

                <div className="flex items-center gap-2">
                    <Target size={15} />
                    Progress {event.progress}%
                </div>
            </div>
        </div>
    );
}