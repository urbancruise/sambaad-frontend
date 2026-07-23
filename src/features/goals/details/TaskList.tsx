"use client";

import { Plus } from "lucide-react";

import { Task } from "@/src/features/tasks/types";

import TaskAccordion from "./TaskAccordion";

interface Props {
    goalId: string;
    tasks: Task[];
}

export default function TaskList({
    goalId,
    tasks,
}: Props) {

    const handleCreateTask = () => {
        // TODO
        // Open CreateTaskModal
    };

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold">

                        Tasks

                    </h2>

                    <p className="text-slate-500">

                        All tasks under this goal

                    </p>

                </div>

                <button
                    onClick={handleCreateTask}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                    <Plus size={18} />

                    Create Task
                </button>

            </div>

            {tasks.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">

                    <h3 className="font-semibold">

                        No Tasks Found

                    </h3>

                    <p className="text-slate-500 mt-2">

                        Create your first task for this goal.

                    </p>

                </div>

            ) : (

                <TaskAccordion

                    goalId={goalId}

                    tasks={tasks}

                />

            )}

        </div>

    );

}