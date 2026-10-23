"use client";

import { useMemo, useState } from "react";

import type { CalendarEvent } from "../types";
import { addDays, eventsOnDay, isSameDay, startOfWeek } from "../calendar.utils";
import { AgendaRow } from "./CalendarEventBar";
import { EventDetailsModal } from "./CalendarModals";

interface Props {
    events: CalendarEvent[];
    loading: boolean;
    showAssignee?: boolean;
}

export default function WeekAgendaView({ events, loading, showAssignee = false }: Props) {
    const [selected, setSelected] = useState<CalendarEvent | null>(null);

    const days = useMemo(() => {
        const start = startOfWeek(new Date());
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, []);

    if (loading && events.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                Loading this week&apos;s agenda...
            </div>
        );
    }

    const today = new Date();

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {days.map((day) => {
                    const list = eventsOnDay(events, day);
                    const isToday = isSameDay(day, today);
                    return (
                        <div
                            key={day.toISOString()}
                            className={`rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900 ${
                                isToday
                                    ? "border-emerald-400 dark:border-emerald-700"
                                    : "border-slate-200 dark:border-slate-800"
                            }`}
                        >
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
                                {isToday && <span className="ml-2 text-emerald-600">· Today</span>}
                            </h3>
                            {list.length === 0 ? (
                                <p className="text-xs italic text-slate-400 dark:text-slate-500">Nothing scheduled</p>
                            ) : (
                                <div className="space-y-2">
                                    {list.map((event) => (
                                        <AgendaRow
                                            key={`${event.type}-${event.id}`}
                                            event={event}
                                            showAssignee={showAssignee}
                                            onSelect={setSelected}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selected && <EventDetailsModal event={selected} onClose={() => setSelected(null)} />}
        </>
    );
}