"use client";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Timer,
} from "lucide-react";

interface TodayProps {
    today: {
        todayTasks: number;
        todayActivities: number;
        dueToday: number;
        missedYesterday: number;
        workingMinutes: number;
    };
}

function MiniCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                        {value}
                    </h3>

                </div>

                <div className={`rounded-lg p-3 ${color}`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}

export default function TodayCard({
    today,
}: TodayProps) {
    return (

        <div className="space-y-4">

            <div>

                <h2 className="text-xl font-bold">
                    Today's Summary
                </h2>

                <p className="text-sm text-slate-500">
                    Your work summary for today
                </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

                <MiniCard
                    title="Today's Tasks"
                    value={today.todayTasks}
                    icon={<CalendarDays size={20} />}
                    color="bg-blue-100 text-blue-600"
                />

                <MiniCard
                    title="Activities"
                    value={today.todayActivities}
                    icon={<CheckCircle2 size={20} />}
                    color="bg-green-100 text-green-600"
                />

                <MiniCard
                    title="Due Today"
                    value={today.dueToday}
                    icon={<Clock3 size={20} />}
                    color="bg-orange-100 text-orange-600"
                />

                <MiniCard
                    title="Missed Yesterday"
                    value={today.missedYesterday}
                    icon={<AlertCircle size={20} />}
                    color="bg-red-100 text-red-600"
                />

                <MiniCard
                    title="Working Time"
                    value={`${today.workingMinutes} min`}
                    icon={<Timer size={20} />}
                    color="bg-violet-100 text-violet-600"
                />

            </div>

        </div>

    );

}