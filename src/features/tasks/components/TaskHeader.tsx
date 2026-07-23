"use client";

import { Calendar, Flag, Target } from "lucide-react";

import { Goal } from "@/src/features/goals/types";
import { Task } from "../types";

import { formatDate } from "@/src/lib/date";

interface Props {
    goal: Goal;
    tasks: Task[];
}

export default function TaskHeader({
    goal,
    tasks,
}: Props) {

    const completedTasks =
        tasks.filter(
            task => task.status === "COMPLETED"
        ).length;

    const progress =
        tasks.length === 0
            ? 0
            : Math.round(
                  (completedTasks / tasks.length) * 100
              );

    const statusColor = {

        PENDING:
            "bg-yellow-100 text-yellow-700",

        IN_PROGRESS:
            "bg-blue-100 text-blue-700",

        COMPLETED:
            "bg-green-100 text-green-700",

        CANCELLED:
            "bg-red-100 text-red-700",

    };

    return (

        <div>

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-xl font-bold">

                        {goal.title}

                    </h2>

                    <p className="mt-2 text-slate-500">

                        {goal.description}

                    </p>

                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColor[
                            goal.status as keyof typeof statusColor
                        ]
                    }`}
                >
                    {goal.status}
                </span>

            </div>

            <div className="mt-6">

                <div className="flex justify-between text-sm">

                    <span>

                        Goal Progress

                    </span>

                    <span>

                        {progress}%

                    </span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-200">

                    <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

                <div className="flex items-center gap-2">

                    <Calendar size={16} />

                    {formatDate(goal.startDate)}

                </div>

                <div className="flex items-center gap-2">

                    <Flag size={16} />

                    {formatDate(goal.dueDate)}

                </div>

                <div className="flex items-center gap-2">

                    <Target size={16} />

                    {goal.goalType}

                </div>

                <div>

                    Priority

                    <span className="ml-2 font-semibold">

                        {goal.priority}

                    </span>

                </div>

            </div>

        </div>

    );

}