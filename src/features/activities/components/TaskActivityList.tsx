"use client";

import { Task } from "@/src/features/tasks/types";
import { Activity } from "../types";
import TaskActivityGroup from "./TaskActivityGroup";

interface Props {
    tasks: Task[];
    activities: Activity[];
}

export default function TaskActivityList({ tasks, activities }: Props) {
    // Unique indexing lookup trace
    const uniqueTasks = Array.from(
        new Map(tasks.map((task) => [task.id, task])).values()
    );

    if (uniqueTasks.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1224]/40 py-16 text-center text-sm font-medium text-slate-400 dark:text-slate-500 shadow-sm">
                No active task streams mapping to display.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Desktop Viewports: Two completely independent vertical columns to prevent row-stretching updates */}
            <div className="hidden md:flex gap-6 w-full items-start">
                {/* Left Column (Even indices) */}
                <div className="flex-1 flex flex-col gap-6">
                    {uniqueTasks
                        .filter((_, index) => index % 2 === 0)
                        .map((task) => (
                            <TaskActivityGroup
                                key={task.id}
                                task={task}
                                activities={activities}
                            />
                        ))}
                </div>

                {/* Right Column (Odd indices) */}
                <div className="flex-1 flex flex-col gap-6">
                    {uniqueTasks
                        .filter((_, index) => index % 2 !== 0)
                        .map((task) => (
                            <TaskActivityGroup
                                key={task.id}
                                task={task}
                                activities={activities}
                            />
                        ))}
                </div>
            </div>

            {/* Mobile Viewports: Single responsive vertical stack */}
            <div className="flex md:hidden flex-col gap-6 w-full">
                {uniqueTasks.map((task) => (
                    <TaskActivityGroup
                        key={task.id}
                        task={task}
                        activities={activities}
                    />
                ))}
            </div>
        </div>
    );
}