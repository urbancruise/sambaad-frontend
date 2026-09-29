"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react";

import { RootState } from "@/src/lib/store";
import { EmployeeTask } from "../type";

import CreateEmployeeActivityModal from "../../activities/components/CreateEmployeeActivityModal";
import EditEmployeeTaskModal from "./EditEmployeeTaskModal";
import { deleteEmployeeTask } from "../api/task.service";

interface Props {
    task: EmployeeTask;
    onChanged?: () => void;
}

const statusColor = {
    PENDING: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const priorityColor = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};

export default function TaskCard({
    task,
    onChanged,
}: Props) {
    const currentUserId = useSelector(
        (state: RootState) => state.auth.user?.id
    );

    const isCreator = task.createdById === currentUserId;

    const [addActivityOpen, setAddActivityOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const progress = Math.min(
        100,
        Math.max(0, Number(task.progress ?? 0))
    );

    const handleDelete = async () => {
        const ok = window.confirm(
            "Delete this task? This will also delete its activities."
        );

        if (!ok) return;

        try {
            setDeleting(true);
            await deleteEmployeeTask(task.id);
            onChanged?.();
        } finally {
            setDeleting(false);
        }
    };

    const dueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
          })
        : "-";

    return (
        <>
            <div
                className="
                    group
                    relative
                    flex
                    min-h-[185px]
                    flex-col
                    rounded-[12px]
                    border
                    border-slate-300
                    bg-gradient-to-br
                    from-white
                    via-slate-50
                    to-slate-100
                    px-3
                    py-3
                    shadow-[0_2px_8px_rgba(15,23,42,0.10)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-[0_5px_15px_rgba(15,23,42,0.14)]
                "
            >
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-2">
                    {/* Title */}
                    <div className="min-w-0 flex-1">
                        <h2
                            className="
                                truncate
                                text-[14px]
                                font-medium
                                leading-tight
                                text-slate-800
                            "
                            title={task.title}
                        >
                            {task.title}
                        </h2>

                        <p
                            className="
                                mt-1
                                truncate
                                text-[9px]
                                leading-tight
                                text-slate-600
                            "
                            title={task.goal?.title}
                        >
                            Goal : {task.goal?.title || "-"}
                        </p>

                        <p
                            className="
                                mt-[2px]
                                line-clamp-1
                                text-[9px]
                                leading-tight
                                text-slate-500
                            "
                            title={task.description || ""}
                        >
                            Desc : {task.description || "-"}
                        </p>
                    </div>

                    {/* Right side controls */}
                    <div className="flex shrink-0 items-center gap-1">
                        <span
                            className={`
                                rounded-full
                                px-2
                                py-[3px]
                                text-[8px]
                                font-semibold
                                leading-none
                                ${priorityColor[
                                    task.priority as keyof typeof priorityColor
                                ]}
                            `}
                        >
                            {task.priority}
                        </span>

                        <span
                            className={`
                                rounded-full
                                border
                                px-2
                                py-[3px]
                                text-[8px]
                                font-medium
                                leading-none
                                ${statusColor[
                                    task.status as keyof typeof statusColor
                                ]}
                            `}
                        >
                            {task.status}
                        </span>

                        {isCreator && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(true)}
                                    title="Edit task"
                                    className="
                                        rounded-full
                                        border
                                        border-slate-200
                                        bg-white
                                        p-1
                                        text-slate-400
                                        transition
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                    "
                                >
                                    <Pencil size={10} />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    title="Delete task"
                                    className="
                                        rounded-full
                                        border
                                        border-slate-200
                                        bg-white
                                        p-1
                                        text-slate-400
                                        transition
                                        hover:bg-red-50
                                        hover:text-red-600
                                        disabled:opacity-40
                                    "
                                >
                                    <Trash2 size={10} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-700">
                            Progress
                        </span>

                        <span className="text-[10px] font-medium text-slate-700">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-[7px] w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500
                                ${
                                    task.status === "COMPLETED"
                                        ? "bg-emerald-500"
                                        : task.status === "IN_PROGRESS"
                                        ? "bg-teal-500"
                                        : "bg-slate-400"
                                }
                            `}
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>

                {/* STATS */}
                <div className="mt-4 grid grid-cols-2 gap-5">
                    <div>
                        <p className="text-[10px] font-medium text-slate-600">
                            Activities
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-slate-800">
                            {task.completedActivities} /{" "}
                            {task.activityCount}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-medium text-slate-600">
                            Due
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-slate-800">
                            {dueDate}
                        </p>
                    </div>
                </div>

                {/* ADD ACTIVITY */}
                <button
                    type="button"
                    onClick={() => setAddActivityOpen(true)}
                    className="
                        mt-auto
                        flex
                        h-[24px]
                        w-full
                        items-center
                        justify-center
                        gap-1
                        rounded-md
                        border
                        border-dashed
                        border-slate-300
                        bg-white/40
                        text-[9px]
                        font-medium
                        text-slate-500
                        transition
                        hover:border-cyan-400
                        hover:bg-cyan-50
                        hover:text-cyan-600
                    "
                >
                    <Plus size={11} />
                    Add Activity to this Task
                </button>
            </div>

            {/* CREATE ACTIVITY MODAL */}
            {/*
                Mounted only while open — see GoalCard.tsx for why this
                matters: mounting unconditionally lets every hook inside
                the modal (data fetches included) run for every single
                TaskCard the instant this list renders, not just the one
                the user opened.
            */}
            {addActivityOpen && (
                <CreateEmployeeActivityModal
                    open={addActivityOpen}
                    onClose={() => setAddActivityOpen(false)}
                    onCreated={() => onChanged?.()}
                    defaultTaskId={task.id}
                />
            )}

            {/* EDIT TASK MODAL */}
            {editOpen && isCreator && (
                <EditEmployeeTaskModal
                    open={editOpen}
                    task={task}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => onChanged?.()}
                />
            )}
        </>
    );
}