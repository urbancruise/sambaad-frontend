"use client";

import {
    Calendar,
    Flag,
    Target,
    TrendingUp,
} from "lucide-react";

import { Goal } from "../types";
import { formatDate } from "@/src/lib/date";

interface Props {
    goal: Goal;
}

export default function GoalInfo({
    goal,
}: Props) {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            {/* Header */}

            <div className="p-8 border-b border-slate-200">

                <div className="flex justify-between items-start">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-900">

                            {goal.title}

                        </h1>

                        <p className="text-slate-500 mt-3 max-w-3xl">

                            {goal.description}

                        </p>

                    </div>

                    <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">

                        {goal.status}

                    </span>

                </div>

            </div>

            {/* Progress */}

            <div className="p-8 border-b border-slate-200">

                <div className="flex justify-between mb-3">

                    <span className="font-semibold">

                        Overall Progress

                    </span>

                    <span className="font-bold">

                        {goal.progress}%

                    </span>

                </div>

                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

                    <div

                        className="h-full bg-emerald-500 transition-all"

                        style={{
                            width: `${goal.progress}%`,
                        }}

                    />

                </div>

            </div>

            {/* Information */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8">

                <div className="flex items-center gap-3">

                    <Target
                        size={20}
                        className="text-blue-600"
                    />

                    <div>

                        <p className="text-xs text-slate-500">

                            Goal Type

                        </p>

                        <p className="font-semibold">

                            {goal.goalType}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <Flag
                        size={20}
                        className="text-red-500"
                    />

                    <div>

                        <p className="text-xs text-slate-500">

                            Priority

                        </p>

                        <p className="font-semibold">

                            {goal.priority}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <Calendar
                        size={20}
                        className="text-emerald-500"
                    />

                    <div>

                        <p className="text-xs text-slate-500">

                            Start Date

                        </p>

                        <p className="font-semibold">

                            {formatDate(goal.startDate)}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <TrendingUp
                        size={20}
                        className="text-amber-500"
                    />

                    <div>

                        <p className="text-xs text-slate-500">

                            Due Date

                        </p>

                        <p className="font-semibold">

                            {formatDate(goal.dueDate)}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}