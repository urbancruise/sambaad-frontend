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
    /** Label for the "view your own calendar" option, e.g. "My Calendar" */
    selfLabel?: string;
    /** Label for the dropdown grouping, e.g. "Team Leads" / "Managers" / "Employees" */
    groupLabel?: string;
}

const SELF_VALUE = "self";

export default function TeamCalendarPage({
    people,
    loading,
    selfLabel = "My Calendar",
    groupLabel = "Team",
}: Props) {
    const [selected, setSelected] = useState<string>(SELF_VALUE);

    const selectedUserId = selected === SELF_VALUE ? undefined : selected;

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View your own schedule, or pick a team member to see theirs.
                </p>
            </div>

            <div className="relative max-w-xs">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm font-medium focus:border-emerald-500 focus:outline-none disabled:opacity-60"
                >
                    <option value={SELF_VALUE}>{selfLabel}</option>
                    {people.length > 0 && (
                        <optgroup label={groupLabel}>
                            {people.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.fullName}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>

            <CalendarView key={selected} userId={selectedUserId} />
        </div>
    );
}