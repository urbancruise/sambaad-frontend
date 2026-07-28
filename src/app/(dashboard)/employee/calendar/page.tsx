"use client";

import CalendarView from "@/src/features/calendar/components/CalendarView";

export default function CalendarPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Calendar</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Your goals, tasks, and activities on a schedule.
                </p>
            </div>
            <CalendarView />
        </div>
    );
}