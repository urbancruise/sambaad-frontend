"use client";

import { CalendarEvent } from "../types";
import CalendarEventBadge from "./CalendarEventBadge";

interface Props {
    date: Date;
    events: CalendarEvent[];
    currentMonth: number;
}

export default function CalendarDay({
    date,
    events,
    currentMonth,
}: Props) {
    const isToday =
        date.toDateString() ===
        new Date().toDateString();

    return (
        <div
            className={`
            relative
            h-20
            border
            p-2
            overflow-visible
            transition
        ${
            date.getMonth() !== currentMonth
                ? "bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"
                : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
        }
    `}
        >
            <div
                className={`
                    mb-2
                    flex
                    justify-end
                    text-sm
                    font-semibold
                    ${
                        isToday
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-700 dark:text-slate-300"
                    }
                `}
            >
                {date.getDate()}
            </div>

            <div className="space-y-1 overflow-hidden">
                {events.slice(0, 4).map(event => (
                    <CalendarEventBadge
                        key={event.id}
                        event={event}
                    />
                ))}

                {events.length > 4 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{events.length - 4} more
                    </div>
                )}
            </div>
        </div>
    );
}