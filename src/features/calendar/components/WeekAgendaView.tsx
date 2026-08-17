"use client";

import { CalendarEvent } from "../types";
import CalendarEventBadge from "./CalendarEventBadge";

type WeeklyAgenda = Record<string, CalendarEvent[]>;

interface Props {
    week: WeeklyAgenda | null;
    loading: boolean;
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeekAgendaView({ week, loading }: Props) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                Loading this week's agenda...
            </div>
        );
    }

    if (!week) {
        return null;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DAYS_ORDER.map((day) => {
                const events = week[day] ?? [];
                return (
                    <div key={day} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3 dark:text-slate-400">
                            {day}
                        </h3>
                        {events.length === 0 ? (
                            <p className="text-xs text-slate-400 italic dark:text-slate-500">Nothing scheduled</p>
                        ) : (
                            <div className="space-y-2">
                                {events.map((event) => (
                                    <CalendarEventBadge key={`${event.type}-${event.id}`} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}