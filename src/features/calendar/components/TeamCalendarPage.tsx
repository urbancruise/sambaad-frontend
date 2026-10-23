"use client";

import { useState } from "react";
import { User } from "lucide-react";

import CalendarView from "./CalendarView";

export interface CalendarPerson {
    id: number;
    fullName: string;
}

interface Props {
    people: CalendarPerson[];
    loading: boolean;
    /** Label for "view your own calendar", e.g. "My Calendar" */
    selfLabel?: string;
    /** Label for the dropdown group of individual people */
    groupLabel?: string;
    /** Label for the option that shows everyone together */
    teamLabel?: string;
}

const SELF_VALUE = "self";
const TEAM_VALUE = "team";

export default function TeamCalendarPage({
    people,
    loading,
    selfLabel = "My Calendar",
    groupLabel = "Team",
    teamLabel = "Whole Team",
}: Props) {
    const [selected, setSelected] = useState<string>(SELF_VALUE);

    const isTeam = selected === TEAM_VALUE;
    const selectedUserId = selected === SELF_VALUE || isTeam ? undefined : selected;

    return (
        <div className="min-h-screen space-y-6 bg-white p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Calendar</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    View your own schedule, everyone together, or one team member.
                </p>
            </div>

            <div className="relative max-w-xs">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                    <option value={SELF_VALUE}>{selfLabel}</option>
                    {people.length > 0 && <option value={TEAM_VALUE}>{teamLabel}</option>}
                    {people.length > 0 && (
                        <optgroup label={groupLabel}>
                            {people.map((p) => (
                                <option key={p.id} value={p.id}>{p.fullName}</option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>

            <CalendarView key={selected} userId={selectedUserId} team={isTeam} />
        </div>
    );
}