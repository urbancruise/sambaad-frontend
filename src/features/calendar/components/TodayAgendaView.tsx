"use client";

import { useState } from "react";

import type { CalendarEvent } from "../types";
import { eventsOnDay } from "../calendar.utils";
import { AgendaRow } from "./CalendarEventBar";
import { EventDetailsModal } from "./CalendarModals";

interface Props {
    events: CalendarEvent[];
    loading: boolean;
    showAssignee?: boolean;
}

export default function TodayAgendaView({ events, loading, showAssignee = false }: Props) {
    const [selected, setSelected] = useState<CalendarEvent | null>(null);

    if (loading && events.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                Loading today&apos;s agenda...
            </div>
        );
    }

    const list = eventsOnDay(events, new Date());

    if (!list.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Nothing scheduled today</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No tasks or activities are active today.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Today&apos;s Agenda · {list.length}
            </h3>
            {list.map((event) => (
                <AgendaRow
                    key={`${event.type}-${event.id}`}
                    event={event}
                    showAssignee={showAssignee}
                    onSelect={setSelected}
                />
            ))}
            {selected && <EventDetailsModal event={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}