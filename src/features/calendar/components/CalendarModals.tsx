"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import type { CalendarEvent } from "../types";
import { PRIORITY, STATE, TYPE_LABEL } from "../calendar.styles";
import { diffDays, formatDateTime, getVisualState } from "../calendar.utils";
import { AgendaRow } from "./CalendarEventBar";

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

const CloseButton = ({ onClose }: { onClose: () => void }) => (
    <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
        <X size={18} />
    </button>
);

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between gap-4">
        <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="text-right font-medium text-slate-800 dark:text-slate-200">{value}</dd>
    </div>
);

export function EventDetailsModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
    const state = getVisualState(event);
    const p = PRIORITY[event.priority] ?? PRIORITY.MEDIUM;
    const overdueDays =
        state === "OVERDUE" && event.end ? Math.max(1, diffDays(new Date(), new Date(event.end))) : 0;
    const progress = Math.min(Math.max(event.progress ?? 0, 0), 100);

    return (
        <Modal onClose={onClose}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        {TYPE_LABEL[event.type]}
                    </p>
                    <h3 className="mt-0.5 break-words text-lg font-bold text-slate-900 dark:text-slate-100">
                        {event.title}
                    </h3>
                </div>
                <CloseButton onClose={onClose} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATE[state].chip}`}>
                    {STATE[state].label}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${p.swatch}`} />
                    {p.label} priority
                </span>
            </div>

            {overdueDays > 0 && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    Overdue by {overdueDays} day{overdueDays === 1 ? "" : "s"}
                </p>
            )}

            <dl className="mt-4 space-y-3 text-sm">
                {event.assigneeName && <Row label="Assigned to" value={event.assigneeName} />}
                <Row label="Starts" value={formatDateTime(event.start)} />
                <Row label="Due" value={formatDateTime(event.end)} />
                {event.parentTitle && (
                    <Row label={event.type === "ACTIVITY" ? "Task" : "Goal"} value={event.parentTitle} />
                )}
            </dl>

            <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full ${p.swatch}`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            {event.description && (
                <p className="mt-4 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-300">
                    {event.description}
                </p>
            )}
        </Modal>
    );
}

interface DayProps {
    day: Date;
    events: CalendarEvent[];
    showAssignee: boolean;
    onSelect: (event: CalendarEvent) => void;
    onClose: () => void;
}

export function DayEventsModal({ day, events, showAssignee, onSelect, onClose }: DayProps) {
    return (
        <Modal onClose={onClose}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {day.toLocaleDateString(undefined, {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {events.length} item{events.length === 1 ? "" : "s"}
                    </p>
                </div>
                <CloseButton onClose={onClose} />
            </div>

            <div className="mt-4 space-y-2">
                {events.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">Nothing scheduled</p>
                ) : (
                    events.map((e) => (
                        <AgendaRow
                            key={`${e.type}-${e.id}`}
                            event={e}
                            showAssignee={showAssignee}
                            onSelect={onSelect}
                        />
                    ))
                )}
            </div>
        </Modal>
    );
}