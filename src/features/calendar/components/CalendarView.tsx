"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Sun, CalendarRange } from "lucide-react";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TodayAgendaView from "./TodayAgendaView";
import WeekAgendaView from "./WeekAgendaView";

import {
    getCalendar,
    getTodayAgenda,
    getWeeklyAgenda,
    getUserCalendar,
    getUserTodayAgenda,
    getUserWeeklyAgenda,
} from "../api/calendar.service";

import { CalendarEvent } from "../types";

type Tab = "month" | "today" | "week";

interface Props {
    /** Omit to view your own calendar; pass a junior's id to view theirs. */
    userId?: string | number;
}

export default function CalendarView({ userId }: Props) {
    const [tab, setTab] = useState<Tab>("month");
    const [month, setMonth] = useState(new Date());

    const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
    const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
    const [weekAgenda, setWeekAgenda] = useState<Record<string, CalendarEvent[]> | null>(null);
    const [loading, setLoading] = useState(false);

    const loadMonth = useCallback(async () => {
        setLoading(true);
        try {
            const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
            const end = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();

            const data = userId
                ? await getUserCalendar(userId, { start, end })
                : await getCalendar({ start, end });

            setMonthEvents(data ?? []);
        } catch {
            setMonthEvents([]);
        } finally {
            setLoading(false);
        }
    }, [userId, month]);

    const loadToday = useCallback(async () => {
        setLoading(true);
        try {
            const data = userId ? await getUserTodayAgenda(userId) : await getTodayAgenda();
            setTodayEvents(data ?? []);
        } catch {
            setTodayEvents([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const loadWeek = useCallback(async () => {
        setLoading(true);
        try {
            const data = userId ? await getUserWeeklyAgenda(userId) : await getWeeklyAgenda();
            setWeekAgenda(data ?? null);
        } catch {
            setWeekAgenda(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (tab === "month") loadMonth();
        if (tab === "today") loadToday();
        if (tab === "week") loadWeek();
    }, [tab, loadMonth, loadToday, loadWeek]);

    const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
        { key: "month", label: "Month", icon: CalendarDays },
        { key: "today", label: "Today", icon: Sun },
        { key: "week", label: "Week", icon: CalendarRange },
    ];

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            tab === key
                                ? "bg-slate-900 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}
            </div>

            {tab === "month" && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <CalendarHeader
                        month={month}
                        onToday={() => setMonth(new Date())}
                        onPrev={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                        onNext={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    />
                    <div className="relative overflow-visible">
                        {loading ? (
                            <div className="py-16 text-center text-slate-400">Loading...</div>
                        ) : (
                            <CalendarGrid month={month} events={monthEvents} />
                        )}
                    </div>
                </div>
            )}

            {tab === "today" && (
                <TodayAgendaView events={todayEvents} loading={loading} />
            )}

            {tab === "week" && (
                <WeekAgendaView week={weekAgenda} loading={loading} />
            )}
        </div>
    );
}