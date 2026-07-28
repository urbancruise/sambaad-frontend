"use client";

import { CalendarEvent } from "../types";
import CalendarEventBadge from "./CalendarEventBadge";

interface Props {
    events: CalendarEvent[];
    loading: boolean;
}

export default function TodayAgendaView({ events, loading }: Props) {
    if (loading) {
        return (
            <div className="rounded-2xl border bg-white p-10 text-center text-slate-400">
                Loading today's agenda...
            </div>
        );
    }

    if (!events.length) {
        return (
            <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-700">Nothing scheduled today</h3>
                <p className="mt-2 text-sm text-slate-500">No goals, tasks, or activities start today.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2">
                Today's Agenda
            </h3>
            {events.map((event) => (
                <div key={`${event.type}-${event.id}`} className="max-w-md">
                    <CalendarEventBadge event={event} />
                </div>
            ))}
        </div>
    );
}