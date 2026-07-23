"use client";

import { Pencil, Trash2 } from "lucide-react";
import { TeamGoal } from "../types";

interface Props {

    goal: TeamGoal;

    onEdit: (goal: TeamGoal) => void;

    onDelete: (goal: TeamGoal) => void;

}

const statusColor = {

    PENDING: "bg-slate-100 text-slate-700",

    IN_PROGRESS: "bg-blue-100 text-blue-700",

    COMPLETED: "bg-emerald-100 text-emerald-700",

    CANCELLED: "bg-red-100 text-red-700"

};

const priorityColor = {

    LOW: "bg-slate-100 text-slate-700",

    MEDIUM: "bg-yellow-100 text-yellow-700",

    HIGH: "bg-orange-100 text-orange-700",

    CRITICAL: "bg-red-100 text-red-700"

};

export default function GoalCard({

    goal,

    onEdit,

    onDelete

}: Props) {

    return (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-lg font-bold">

                        {goal.title}

                    </h2>

                    <p className="mt-2 text-sm text-slate-500">

                        {goal.description}

                    </p>

                </div>

                <div className="flex gap-2">

                    <button

                        onClick={() => onEdit(goal)}

                        className="rounded-lg border p-2 hover:bg-slate-100"

                    >

                        <Pencil size={16} />

                    </button>

                    <button

                        onClick={() => onDelete(goal)}

                        className="rounded-lg border p-2 text-red-500 hover:bg-red-50"

                    >

                        <Trash2 size={16} />

                    </button>

                </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-2">

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor[goal.priority as keyof typeof priorityColor]}`}>

                    {goal.priority}

                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[goal.status as keyof typeof statusColor]}`}>

                    {goal.status}

                </span>

            </div>

            <div className="mt-5">

                <div className="mb-2 flex justify-between">

                    <span>Progress</span>

                    <span>{goal.progress}%</span>

                </div>

                <div className="h-2 rounded-full bg-slate-200">

                    <div

                        className="h-full rounded-full bg-emerald-500"

                        style={{

                            width: `${goal.progress}%`

                        }}

                    />

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

                <div>

                    <p className="text-xs text-slate-500">

                        Assigned To

                    </p>

                    <p className="font-medium">

                        {goal.assignedTo.fullName}

                    </p>

                </div>

                <div>

                    <p className="text-xs text-slate-500">

                        Due Date

                    </p>

                    <p className="font-medium">

                        {

                            new Date(

                                goal.dueDate

                            ).toLocaleDateString()

                        }

                    </p>

                </div>

            </div>

        </div>

    );

}