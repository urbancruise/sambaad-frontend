"use client";

import { Calendar, CheckCircle2 } from "lucide-react";

import { formatDate } from "@/src/lib/date";
import { TodayGoal } from "../../types";

interface Props {
    work: TodayGoal[];
    onComplete: (
        activityId: string
    ) => void;
    updatingActivityId?: string | null;
}
export default function TodayWorkCard({
    work,
    onComplete,
    updatingActivityId = null,
}: Props) {
    return (

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-min">

            <h2 className="text-xl font-bold mb-6">

                Today's Work

            </h2>

            {work.length === 0 && (

                <div className="text-center py-10 text-slate-500">

                    Nothing scheduled for today 🎉

                </div>

            )}

            <div className="space-y-6">

                {work.map((goal) => (
                    <div
                        key={goal.id}
                        className="border rounded-xl p-5"
                    >

                        {/* Goal */}

                        <div className="flex justify-between items-center">

                            <div>

                                <h3 className="font-bold text-lg">

                                    {goal.title}

                                </h3>

                                <p className="text-sm text-slate-500">

                                    {goal.goalType}

                                </p>

                            </div>

                            <div className="text-sm font-semibold">

                                {goal.progress}%

                            </div>

                        </div>

                        {/* Tasks */}

                        <div className="space-y-5 mt-5">

                            {goal.tasks.map((task) => (

                                <div
                                    key={task.id}
                                    className="bg-slate-50 rounded-xl p-4"
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <h4 className="font-semibold">

                                                {task.title}

                                            </h4>

                                            <p className="text-xs text-slate-500 mt-1">

                                                {task.priority}

                                            </p>

                                        </div>

                                        <div className="flex items-center gap-2 text-xs">

                                            <Calendar size={14} />

                                            {formatDate(task.dueDate)}

                                        </div>

                                    </div>

                                    {/* Activities */}

                                    <div className="mt-4 space-y-2">

                                        {task.activities.map(
                                            (activity) => (

                                                <div
                                                    key={activity.id}
                                                    className="flex items-center justify-between bg-white rounded-lg border px-3 py-2"
                                                >

                                                    <div>

                                                        <p className="font-medium">

                                                            {activity.title}

                                                        </p>

                                                        <p className="text-xs text-slate-500">

                                                            {activity.status}

                                                        </p>

                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            onComplete(activity.id);
                                                        }}
                                                        disabled={
                                                            activity.status === "COMPLETED" ||
                                                            updatingActivityId === activity.id
                                                        }
                                                    >
                                                        <CheckCircle2
                                                            size={22}
                                                            className={
                                                                activity.status === "COMPLETED"
                                                                    ? "text-green-500"
                                                                    : "text-slate-300 hover:text-green-500"
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}
