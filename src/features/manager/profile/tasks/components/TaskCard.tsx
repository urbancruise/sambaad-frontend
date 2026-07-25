"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react";

import { RootState } from "@/src/lib/store";
import { EmployeeTask } from "../type";
import CreateEmployeeActivityModal from "./CreateEmployeeTaskModal";
import EditEmployeeTaskModal from "./EditEmployeeTaskModal";
import { deleteEmployeeTask } from "../api/task.service";

interface Props {
    task: EmployeeTask;
    onChanged?: () => void;
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

export default function TaskCard({

    task,
    onChanged

}: Props) {

    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const isCreator = task.createdById === currentUserId;
    console.log(currentUserId)
    console.log("this",task)

    const [addActivityOpen, setAddActivityOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        const ok = window.confirm("Delete this task? This will also delete its activities.");
        if (!ok) return;

        try {
            setDeleting(true);
            await deleteEmployeeTask(task.id);
            onChanged?.();
        } finally {
            setDeleting(false);
        }
    };

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-lg font-semibold">

                        {task.title}

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Goal : {task.goal.title}

                    </p>

                </div>

                <div className="flex items-start gap-2">

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor[task.priority as keyof typeof priorityColor]}`}>

                        {task.priority}

                    </span>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[task.status as keyof typeof statusColor]}`}>

                        {task.status}

                    </span>

                    {/* Action buttons — creator only */}
                    {isCreator && (
                        <div className="flex items-center gap-1 ml-1">
                            <button
                                onClick={() => setEditOpen(true)}
                                title="Edit task"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                title="Delete task"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    )}

                </div>

            </div>

            <div className="mt-5">

                <div className="flex justify-between mb-2">

                    <span>Progress</span>

                    <span>{task.progress}%</span>

                </div>

                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

                    <div

                        className="h-full bg-emerald-500"

                        style={{

                            width: `${task.progress}%`

                        }}

                    />

                </div>

            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">

                <div>

                    <p className="text-sm text-slate-500">

                        Activities

                    </p>

                    <p className="font-semibold">

                        {task.completedActivities} / {task.activityCount}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Hours

                    </p>

                    <p className="font-semibold">

                        {task.estimatedHours ?? "-"}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Due

                    </p>

                    <p className="font-semibold">

                        {

                            new Date(

                                task.dueDate

                            ).toLocaleDateString()

                        }

                    </p>

                </div>

            </div>

            {/* Jump straight into creating an activity inside this task */}
            <button
                onClick={() => setAddActivityOpen(true)}
                className="mt-5 flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-500 hover:border-cyan-400 hover:text-cyan-600 transition w-full justify-center"
            >
                <Plus size={14} />
                Add Activity to this Task
            </button>

            <CreateEmployeeActivityModal
                open={addActivityOpen}
                onClose={() => setAddActivityOpen(false)}
                onCreated={() => onChanged?.()}
                defaultTaskId={task.id}
            />

            {isCreator && (
                <EditEmployeeTaskModal
                    open={editOpen}
                    task={task}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => onChanged?.()}
                />
            )}

        </div>

    );

}
