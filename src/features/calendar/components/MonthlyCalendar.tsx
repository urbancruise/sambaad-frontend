"use client";

import { useMemo, useState } from "react";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { getGridRange } from "../calendar.utils";

export default function MonthCalendar() {
    const [month, setMonth] = useState(new Date());
    const { gridStart, gridEnd } = useMemo(() => getGridRange(month), [month]);
    const { events, loading } = useCalendarEvents({ start: gridStart, end: gridEnd });

    // goals run for months, so keep the small widget to tasks + activities
    const items = useMemo(() => events.filter((e) => e.type !== "GOAL"), [events]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CalendarHeader
                month={month}
                onToday={() => setMonth(new Date())}
                onPrev={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                onNext={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            />
            <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <CalendarGrid month={month} events={items} compact />
            </div>
        </div>
    );
}