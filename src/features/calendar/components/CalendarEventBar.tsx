"use client";

import { Activity as ActivityIcon, Check, ClipboardList, Target } from "lucide-react";

import type { CalendarEvent } from "../types";
import { PRIORITY, STATE, TYPE_LABEL } from "../calendar.styles";
import {
    formatDateTime,
    getVisualState,
    initials,
    type PlacedEvent,
    type VisualState,
} from "../calendar.utils";

const TYPE_ICON = { GOAL: Target, TASK: ClipboardList, ACTIVITY: ActivityIcon } as const;

export function StateDot({ state }: { state: VisualState }) {
    if (state === "COMPLETED") {
        return <Check size={12} strokeWidth={3} className="shrink-0 text-emerald-600 dark:text-emerald-400" />;
    }
    return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATE[state].dot}`} />;
}

export const barClasses = (state: VisualState, priority: string) => {
    const p = PRIORITY[priority] ?? PRIORITY.MEDIUM;
    switch (state) {
        case "OVERDUE":
            return "bg-red-50 text-red-800 ring-1 ring-inset ring-red-300 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-800";
        case "COMPLETED":
            return "bg-emerald-50 text-slate-400 dark:bg-emerald-950/20 dark:text-slate-500";
        case "CANCELLED":
            return "border border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500";
        case "IN_PROGRESS":
            return p.active;
        default:
            return p.pending;
    }
};

const strike = (state: VisualState) =>
    state === "COMPLETED" || state === "CANCELLED" ? "line-through" : "";

/* ---------- bar used in the month grid ---------- */

interface BarProps {
    placed: PlacedEvent;
    compact: boolean;
    showAssignee: boolean;
    onSelect: (event: CalendarEvent) => void;
}

export function CalendarEventBar({ placed, compact, showAssignee, onSelect }: BarProps) {
    const { event, startCol, span, lane, continuesBefore, continuesAfter } = placed;
    const state = getVisualState(event);
    const p = PRIORITY[event.priority] ?? PRIORITY.MEDIUM;
    const Icon = TYPE_ICON[event.type];

    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            title={`${event.title} — ${STATE[state].label}${event.assigneeName ? ` · ${event.assigneeName}` : ""}`}
            style={{ gridColumn: `${startCol + 1} / span ${span}`, gridRow: lane + 2 }}
            className={`pointer-events-auto relative flex min-w-0 items-center gap-1.5 overflow-hidden text-left font-semibold transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                compact ? "h-[18px] text-[10px]" : "h-6 text-[11px]"
            } ${continuesBefore ? "rounded-l-none pl-1.5" : "ml-1 rounded-l-md pl-2"} ${
                continuesAfter ? "rounded-r-none pr-1.5" : "mr-1 rounded-r-md pr-1.5"
            } ${barClasses(state, event.priority)} ${strike(state)}`}
        >
            {!continuesBefore && (
                <span className={`absolute inset-y-0 left-0 w-[3px] ${p.swatch}`} />
            )}
            <StateDot state={state} />
            {!compact && <Icon size={11} className="shrink-0 opacity-60" />}
            {showAssignee && event.assigneeName && (
                <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-white/80 text-[8px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                    {initials(event.assigneeName)}
                </span>
            )}
            <span className="truncate">{event.title}</span>
            {state === "IN_PROGRESS" && event.progress > 0 && (
                <span
                    className={`absolute bottom-0 left-0 h-[2px] ${p.swatch}`}
                    style={{ width: `${Math.min(event.progress, 100)}%` }}
                />
            )}
        </button>
    );
}

/* ---------- row used in Today / Week / day list ---------- */

interface RowProps {
    event: CalendarEvent;
    showAssignee?: boolean;
    onSelect: (event: CalendarEvent) => void;
}

export function AgendaRow({ event, showAssignee = false, onSelect }: RowProps) {
    const state = getVisualState(event);
    const p = PRIORITY[event.priority] ?? PRIORITY.MEDIUM;

    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:brightness-95 ${barClasses(state, event.priority)}`}
        >
            <span className={`h-8 w-1 shrink-0 rounded-full ${p.swatch}`} />
            <StateDot state={state} />
            <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${strike(state)}`}>{event.title}</p>
                <p className="truncate text-xs opacity-70">
                    {TYPE_LABEL[event.type]} · {formatDateTime(event.start)}
                    {event.end ? ` → ${formatDateTime(event.end)}` : ""}
                    {showAssignee && event.assigneeName ? ` · ${event.assigneeName}` : ""}
                </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATE[state].chip}`}>
                {STATE[state].label}
            </span>
        </button>
    );
}