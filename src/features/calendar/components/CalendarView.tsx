"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Sun, CalendarRange } from "lucide-react";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TodayAgendaView from "./TodayAgendaView";
import WeekAgendaView from "./WeekAgendaView";
import { StateDot } from "./CalendarEventBar";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { PRIORITY, STATE } from "../calendar.styles";
import { addDays, endOfDay, getGridRange, startOfDay, startOfWeek, type VisualState } from "../calendar.utils";
import type { CalendarType } from "../types";

type Tab = "month" | "today" | "week";

interface Props {
    /** Omit to view your own calendar; pass a person's id to view theirs. */
    userId?: string | number;
    /** View everyone in your team (the whole organization for admins). */
    team?: boolean;
}

const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
    { key: "month", label: "Month", icon: CalendarDays },
    { key: "today", label: "Today", icon: Sun },
    { key: "week", label: "Week", icon: CalendarRange },
];

const TYPE_OPTIONS: { key: CalendarType; label: string }[] = [
    { key: "TASK", label: "Tasks" },
    { key: "ACTIVITY", label: "Activities" },
    { key: "GOAL", label: "Goals" },
];

const STATES: VisualState[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE", "CANCELLED"];

function Legend() {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold">Status</span>
                {STATES.map((s) => (
                    <span key={s} className="flex items-center gap-1.5">
                        <StateDot state={s} />
                        {STATE[s].label}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold">Priority (left edge)</span>
                {Object.entries(PRIORITY).map(([key, p]) => (
                    <span key={key} className="flex items-center gap-1.5">
                        <span className={`h-3 w-1 rounded-full ${p.swatch}`} />
                        {p.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function CalendarView({ userId, team = false }: Props) {
    const [tab, setTab] = useState<Tab>("month");
    const [month, setMonth] = useState(new Date());
    const [types, setTypes] = useState<CalendarType[]>(["TASK", "ACTIVITY"]);

    const range = useMemo(() => {
        const now = new Date();
        if (tab === "today") return { start: startOfDay(now), end: endOfDay(now) };
        if (tab === "week") {
            const s = startOfWeek(now);
            return { start: s, end: endOfDay(addDays(s, 6)) };
        }
        const g = getGridRange(month);
        return { start: g.gridStart, end: g.gridEnd };
    }, [tab, month]);

    const { events, loading, error } = useCalendarEvents({
        userId,
        team,
        start: range.start,
        end: range.end,
    });

    const visible = useMemo(() => events.filter((e) => types.includes(e.type)), [events, types]);

    const toggleType = (t: CalendarType) =>
        setTypes((cur) =>
            cur.includes(t) ? (cur.length > 1 ? cur.filter((x) => x !== t) : cur) : [...cur, t]
        );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                tab === key
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-950"
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {loading && <span className="text-xs text-slate-400">Loading…</span>}
                    {TYPE_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => toggleType(key)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                types.includes(key)
                                    ? "bg-emerald-600 text-white"
                                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                </p>
            )}

            {tab === "month" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CalendarHeader
                        month={month}
                        onToday={() => setMonth(new Date())}
                        onPrev={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                        onNext={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    />
                    <Legend />
                    <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                        <CalendarGrid month={month} events={visible} showAssignee={team} />
                    </div>
                </div>
            )}

            {tab === "today" && (
                <TodayAgendaView events={visible} loading={loading} showAssignee={team} />
            )}
            {tab === "week" && (
                <WeekAgendaView events={visible} loading={loading} showAssignee={team} />
            )}
        </div>
    );
}