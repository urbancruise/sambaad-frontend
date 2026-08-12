"use client";

import {
    CalendarClock,
    Clock3,
} from "lucide-react";

interface Deadline {
    id: string;
    title: string;
    priority: string;
    dueDate: string;
    progress: number;
    task: {
        title: string;
    };
}

interface DeadlineProps {

    deadlines: {

        overdue: Deadline[];

        today: Deadline[];

        tomorrow: Deadline[];

        thisWeek: Deadline[];

    };

}

function PriorityColor(priority: string) {

    switch (priority) {

        case "CRITICAL":
            return "bg-red-100 text-red-700";

        case "HIGH":
            return "bg-orange-100 text-orange-700";

        case "MEDIUM":
            return "bg-yellow-100 text-yellow-700";

        default:
            return "bg-green-100 text-green-700";

    }

}

export default function DeadlineCard({
    deadlines,
}: DeadlineProps) {

    const allDeadlines = [

        ...deadlines.overdue,

        ...deadlines.today,

        ...deadlines.tomorrow,

        ...deadlines.thisWeek,

    ];

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-xl font-bold">
                        Upcoming Deadlines
                    </h2>

                    <p className="text-sm text-slate-500">
                        Activities requiring attention
                    </p>

                </div>

                <CalendarClock  className="text-slate-500" />

            </div>

            {allDeadlines.length === 0 ? (

                <div className="py-10 text-center text-slate-400">

                    No upcoming deadlines.

                </div>

            ) : (

                <div className="space-y-4">

                    {allDeadlines.map((activity) => (

                        <div
                            key={activity.id}
                            className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                        >

                            <div className="flex justify-between">

                                <div>

                                    <h3 className="font-semibold">

                                        {activity.title}

                                    </h3>

                                    <p className="text-sm text-slate-500">

                                        {activity.task.title}

                                    </p>

                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${PriorityColor(activity.priority)}`}
                                >

                                    {activity.priority}

                                </span>

                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">

                                <div className="flex items-center gap-2">

                                    <Clock3 size={15} />

                                    {new Date(activity.dueDate).toLocaleDateString()}

                                </div>

                                <div>

                                    {activity.progress}% Complete

                                </div>

                            </div>

                            <div className="mt-3 h-2 rounded-full bg-slate-200">

                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                        width: `${activity.progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}
