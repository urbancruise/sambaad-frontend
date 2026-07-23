"use client";

import { useMemo } from "react";
import { Goal } from "@/src/features/goals/types";
import { Task } from "../types";
import TaskGroup from "./TaskGroup";
import { AlertCircle } from "lucide-react";

interface Props {
    goals: Goal[];
    tasks: Task[];
}

export default function TaskList({ goals, tasks }: Props) {
    const groupedGoals = useMemo(() => {
        return goals.map((goal) => ({
            goal,
            tasks: tasks.filter((task) => task.goalId === goal.id),
        }));
    }, [goals, tasks]);

    if (groupedGoals.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-100/80 bg-white p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="inline-flex p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 mb-3">
                    <AlertCircle size={22} />
                </div>
                <h2 className="text-base font-bold tracking-tight text-slate-800">
                    Parent Objectives Required
                </h2>
                <p className="mt-1 text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    A goal container must exist before system tasks can map onto your visual workspace.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {groupedGoals.map((group) => (
                <TaskGroup
                    key={group.goal.id}
                    goal={group.goal}
                    tasks={group.tasks}
                />
            ))}
        </div>
    );
}