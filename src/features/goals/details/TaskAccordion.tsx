"use client";

import { useState } from "react";

import {
    ChevronDown,
    ChevronRight,
    Calendar,
    Flag,
} from "lucide-react";

import { Task } from "@/src/features/tasks/types";

import { formatDate } from "@/src/lib/date";

import ActivityList from "./ActivityList";

interface Props {

    goalId: string;

    tasks: Task[];

}

export default function TaskAccordion({

    goalId: _goalId,

    tasks,

}: Props) {

    const [expandedTask, setExpandedTask] =
        useState<string | null>(null);

    return (

        <div className="space-y-4">

            {tasks.map((task) => {

                const open =
                    expandedTask === task.id;

                return (

                    <div
                        key={task.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >

                        {/* Header */}

                        <button

                            onClick={() =>
                                setExpandedTask(
                                    open
                                        ? null
                                        : task.id
                                )
                            }

                            className="w-full flex justify-between items-center p-6 hover:bg-slate-50"

                        >

                            <div className="flex items-center gap-4">

                                {open ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}

                                <div className="text-left">

                                    <h3 className="font-bold text-lg">

                                        {task.title}

                                    </h3>

                                    <p className="text-sm text-slate-500">

                                        {task.description}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-6 text-sm">

                                <div>

                                    <p className="text-slate-400">

                                        Progress

                                    </p>

                                    <p className="font-bold">

                                        {task.progress}%

                                    </p>

                                </div>

                                <div>

                                    <p className="text-slate-400">

                                        Status

                                    </p>

                                    <p className="font-semibold">

                                        {task.status}

                                    </p>

                                </div>

                            </div>

                        </button>

                        {/* Progress */}

                        <div className="px-6">

                            <div className="h-2 rounded-full bg-slate-200">

                                <div

                                    className="h-full bg-emerald-500 rounded-full"

                                    style={{
                                        width: `${task.progress}%`,
                                    }}

                                />

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex gap-8 text-sm px-6 py-4 border-b border-slate-100">

                            <div className="flex items-center gap-2">

                                <Calendar size={16} />

                                {formatDate(
                                    task.dueDate
                                )}

                            </div>

                            <div className="flex items-center gap-2">

                                <Flag size={16} />

                                {task.priority}

                            </div>

                        </div>

                        {/* Activities */}

                        {open && (

                            <div className="p-6 bg-slate-50">

                                <ActivityList
                                    taskId={task.id}
                                />

                            </div>

                        )}

                    </div>

                );

            })}

        </div>

    );

}
