"use client";

import {
    Target,
    ClipboardList,
    CheckSquare,
    AlertTriangle,
} from "lucide-react";

interface OverviewCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({
    title,
    value,
    icon,
    color,
}: OverviewCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h2>
                </div>

                <div
                    className={`rounded-xl p-3 ${color}`}
                >
                    {icon}
                </div>

            </div>
        </div>
    );
}

interface Props {

    overview: {

        totalGoals: number;

        totalTasks: number;

        totalActivities: number;

        pendingActivities: number;

    };

}

export default function OverviewCard({
    overview,
}: Props) {

    return (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
                title="Goals"
                value={overview.totalGoals}
                icon={<Target size={22} />}
                color="bg-blue-100 text-blue-600"
            />

            <StatCard
                title="Tasks"
                value={overview.totalTasks}
                icon={<ClipboardList size={22} />}
                color="bg-emerald-100 text-emerald-600"
            />

            <StatCard
                title="Activities"
                value={overview.totalActivities}
                icon={<CheckSquare size={22} />}
                color="bg-violet-100 text-violet-600"
            />

            <StatCard
                title="Pending"
                value={overview.pendingActivities}
                icon={<AlertTriangle size={22} />}
                color="bg-orange-100 text-orange-600"
            />

        </div>

    );

}