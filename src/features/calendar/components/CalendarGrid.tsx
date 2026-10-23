"use client";

import { useMemo, useState } from "react";

import type { CalendarEvent } from "../types";
import { eventsOnDay, getGridRange, isSameDay, layoutWeek, weekdayLabels } from "../calendar.utils";
import { CalendarEventBar } from "./CalendarEventBar";
import { DayEventsModal, EventDetailsModal } from "./CalendarModals";

interface Props {
    month: Date;
    events: CalendarEvent[];
    /** Smaller rows for dashboard widgets. */
    compact?: boolean;
    /** Show the assignee's initials on each bar (team views). */
    showAssignee?: boolean;
}

interface WeekRowProps {
    days: Date[];
    month: Date;
    events: CalendarEvent[];
    compact: boolean;
    showAssignee: boolean;
    maxLanes: number;
    onSelectEvent: (e: CalendarEvent) => void;
    onSelectDay: (d: Date) => void;
}

function WeekRow({ days, month, events, compact, showAssignee, maxLanes, onSelectEvent, onSelectDay }: WeekRowProps) {
    const placed = useMemo(() => layoutWeek(days, events), [days, events]);
    const visible = placed.filter((p) => p.lane < maxLanes);
    const hidden = days.map(
        (_, col) => placed.filter((p) => p.lane >= maxLanes && p.startCol <= col && col < p.startCol + p.span).length
    );
    const today = new Date();

    return (
        <div className="relative border-b border-slate-200 last:border-b-0 dark:border-slate-800">
            {/* background cells */}
            <div className="absolute inset-0 grid grid-cols-7" aria-hidden>
                {days.map((day) => {
                    const outside = day.getMonth() !== month.getMonth();
                    const weekend = day.getDay() === 0 || day.getDay() === 6;
                    const tone = outside
                        ? "bg-slate-50 dark:bg-slate-900/50"
                        : weekend
                        ? "bg-slate-50/60 dark:bg-slate-900/80"
                        : "bg-white dark:bg-slate-900";
                    return (
                        <div
                            key={day.toISOString()}
                            className={`border-r border-slate-200 last:border-r-0 dark:border-slate-800 ${tone}`}
                        />
                    );
                })}
            </div>

            {/* day numbers + bars */}
            <div
                className={`pointer-events-none relative grid grid-cols-7 content-start gap-y-1 pb-2 ${
                    compact ? "min-h-[84px]" : "min-h-[124px]"
                }`}
                style={{
                    gridTemplateRows: compact ? "24px" : "30px",
                    gridAutoRows: compact ? "18px" : "24px",
                }}
            >
                {days.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    const outside = day.getMonth() !== month.getMonth();
                    return (
                        <div
                            key={`n-${day.toISOString()}`}
                            style={{ gridColumn: i + 1, gridRow: 1 }}
                            className="flex items-start px-1.5 pt-1"
                        >
                            <button
                                type="button"
                                onClick={() => onSelectDay(day)}
                                className={`pointer-events-auto flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-semibold transition ${
                                    isToday
                                        ? "bg-emerald-600 text-white"
                                        : outside
                                        ? "text-slate-400 hover:bg-slate-200/70 dark:text-slate-600 dark:hover:bg-slate-700/60"
                                        : "text-slate-700 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-700/60"
                                }`}
                            >
                                {day.getDate() === 1
                                    ? day.toLocaleDateString(undefined, { day: "numeric", month: "short" })
                                    : day.getDate()}
                            </button>
                        </div>
                    );
                })}

                {visible.map((p) => (
                    <CalendarEventBar
                        key={`${p.event.type}-${p.event.id}`}
                        placed={p}
                        compact={compact}
                        showAssignee={showAssignee}
                        onSelect={onSelectEvent}
                    />
                ))}

                {hidden.map(
                    (n, col) =>
                        n > 0 && (
                            <button
                                key={`more-${col}`}
                                type="button"
                                onClick={() => onSelectDay(days[col])}
                                style={{ gridColumn: col + 1, gridRow: maxLanes + 2 }}
                                className="pointer-events-auto mx-1 truncate rounded px-1.5 text-left text-[11px] font-semibold text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-700/60"
                            >
                                +{n} more
                            </button>
                        )
                )}
            </div>
        </div>
    );
}

export default function CalendarGrid({ month, events, compact = false, showAssignee = false }: Props) {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const { days, weeks } = useMemo(() => getGridRange(month), [month]);
    const weekRows = useMemo(
        () => Array.from({ length: weeks }, (_, w) => days.slice(w * 7, w * 7 + 7)),
        [days, weeks]
    );
    const labels = useMemo(weekdayLabels, []);
    const maxLanes = compact ? 2 : 4;

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                    {labels.map((l) => (
                        <div
                            key={l}
                            className="py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                        >
                            {l}
                        </div>
                    ))}
                </div>

                {weekRows.map((wd) => (
                    <WeekRow
                        key={wd[0].toISOString()}
                        days={wd}
                        month={month}
                        events={events}
                        compact={compact}
                        showAssignee={showAssignee}
                        maxLanes={maxLanes}
                        onSelectEvent={setSelectedEvent}
                        onSelectDay={setSelectedDay}
                    />
                ))}
            </div>

            {selectedEvent && (
                <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
            {selectedDay && (
                <DayEventsModal
                    day={selectedDay}
                    events={eventsOnDay(events, selectedDay)}
                    showAssignee={showAssignee}
                    onSelect={(e) => { setSelectedDay(null); setSelectedEvent(e); }}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </>
    );
}