"use client";

import { Clock3, FolderKanban } from "lucide-react";

interface Activity {
    id: string;
    title: string;
    task: {           
        id: string;
        title: string;
    };
    status: string;
    priority?: string;
    progress: number;
    updatedAt: string;
}

interface Props {
    activities: Activity[];
}

function badgeColor(priority?: string) {
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

export default function RecentActivityCard({ activities }: Props) {
    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-xl font-bold">
                        Recent Activities
                    </h2>

                    <p className="text-sm text-slate-500">
                        Latest work updates
                    </p>

                </div>

                <FolderKanban className="text-slate-500" />

            </div>

            <div className="space-y-4">

                {activities.length === 0 ? (

                    <div className="text-center py-8 text-slate-400">
                        No recent activity.
                    </div>

                ) : (

                    activities.map((activity) => (

                        <div
                            key={activity.id}
                            className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
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
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor(activity.priority)}`}
                                >
                                    {activity.priority}
                                </span>

                            </div>

                            <div className="mt-3 h-2 bg-slate-200 rounded-full">

                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                        width: `${activity.progress}%`,
                                    }}
                                />

                            </div>

                            <div className="mt-3 flex justify-between text-sm text-slate-500">

                                <span>
                                    {activity.status}
                                </span>

                                <span className="flex items-center gap-1">

                                    <Clock3 size={14} />

                                    {new Date(
                                        activity.updatedAt
                                    ).toLocaleString()}

                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}