"use client";

import { Pencil, Trash2 } from "lucide-react";
import { TeamTask } from "../type";

interface Props {
    task: TeamTask;
    onEdit: (task: TeamTask) => void;
    onDelete: (task: TeamTask) => void;
}

export default function TaskCard({

    task,
    onEdit,
    onDelete

}: Props) {

    return (

        <div className="rounded-xl border bg-white p-5">

            <div className="flex justify-between">

                <div>

                    <h3 className="font-semibold text-lg">

                        {task.title}

                    </h3>

                    <p className="text-sm text-slate-500">

                        {task.goal.title}

                    </p>

                    <p className="text-sm mt-2">

                        {task.description}

                    </p>

                </div>

                <div className="flex gap-2">

                    <button

                        onClick={() => onEdit(task)}

                        className="rounded-lg border p-2"

                    >

                        <Pencil size={16} />

                    </button>

                    <button

                        onClick={() => onDelete(task)}

                        className="rounded-lg border border-red-200 p-2 text-red-500"

                    >

                        <Trash2 size={16} />

                    </button>

                </div>

            </div>

            <div className="mt-5 h-2 rounded bg-slate-200">

                <div

                    className="h-full rounded bg-emerald-500"

                    style={{

                        width: `${task.progress}%`

                    }}

                />

            </div>

            <div className="mt-4 flex justify-between text-sm">

                <span>

                    {task.assignedTo.fullName}

                </span>

                <span>

                    {

                        new Date(

                            task.dueDate

                        ).toLocaleDateString()

                    }

                </span>

            </div>

        </div>

    );

}