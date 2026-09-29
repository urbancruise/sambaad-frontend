"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Pencil,
    Trash2,
    Plus,
    ListTodo,
    CalendarDays,
} from "lucide-react";

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
    PENDING: "bg-slate-500/30 text-slate-200 border-slate-400/20",
    IN_PROGRESS: "bg-blue-500/30 text-blue-200 border-blue-400/20",
    COMPLETED: "bg-emerald-500/30 text-emerald-200 border-emerald-400/20",
    CANCELLED: "bg-red-500/30 text-red-200 border-red-400/20",
};

const priorityColor = {
    LOW: "bg-slate-500/30 text-slate-200",
    MEDIUM: "bg-yellow-400/20 text-yellow-200",
    HIGH: "bg-orange-500/20 text-orange-200",
    CRITICAL: "bg-red-500/20 text-red-200",
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

    const formattedDueDate = task.dueDate
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
                    group relative
                    w-full
                    min-h-[175px]
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-cyan-200/60
                    bg-gradient-to-br
                    from-[#25393d]
                    via-[#172a2d]
                    to-[#101c1e]
                    px-5
                    pt-4
                    pb-3
                    text-white
                    shadow-[0_8px_30px_rgba(0,0,0,0.28)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-cyan-200
                    hover:shadow-[0_12px_35px_rgba(34,211,238,0.18)]
                "
            >
                {/* Outer glow */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-[3px]
                        rounded-[25px]
                        border
                        border-cyan-300/20
                    "
                />

                {/* Top content */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                        {/* Priority + Status */}
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`
                                    rounded-full
                                    px-2.5
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    tracking-wide
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
                                    px-2.5
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    tracking-wide
                                    ${statusColor[
                                        task.status as keyof typeof statusColor
                                    ]}
                                `}
                            >
                                {task.status}
                            </span>
                        </div>

                        {/* Action buttons */}
                        {isCreator && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    opacity-0
                                    transition
                                    group-hover:opacity-100
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(true)}
                                    title="Edit task"
                                    className="
                                        rounded-md
                                        bg-white/10
                                        p-1.5
                                        text-slate-300
                                        transition
                                        hover:bg-blue-500/20
                                        hover:text-blue-300
                                    "
                                >
                                    <Pencil size={11} />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    title="Delete task"
                                    className="
                                        rounded-md
                                        bg-white/10
                                        p-1.5
                                        text-slate-300
                                        transition
                                        hover:bg-red-500/20
                                        hover:text-red-300
                                        disabled:opacity-40
                                    "
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Task title */}
                    <div className="mt-2">
                        <h2
                            className="
                                truncate
                                text-[14px]
                                font-medium
                                tracking-wide
                                text-white
                            "
                            title={task.title}
                        >
                            {task.title}
                        </h2>

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[10px]
                                text-slate-400
                            "
                            title={task.goal?.title}
                        >
                            Goal: {task.goal?.title || "-"}
                        </p>
                    </div>

                    {/* Progress + activity/date */}
                    <div className="mt-2 flex items-center gap-3">
                        {/* Circular progress */}
                        <div className="relative h-[58px] w-[58px] shrink-0">
                            <svg
                                className="h-full w-full -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                {/* Background */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="rgba(148,163,184,0.18)"
                                    strokeWidth="7"
                                />

                                {/* Progress */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#67e8f9"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeDasharray={264}
                                    strokeDashoffset={
                                        264 - (264 * progress) / 100
                                    }
                                    className="
                                        transition-all
                                        duration-700
                                    "
                                />
                            </svg>

                            <div
                                className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    text-[11px]
                                    font-semibold
                                    text-white
                                "
                            >
                                {progress}%
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <ListTodo
                                    size={11}
                                    className="text-slate-400"
                                />

                                <span className="text-[10px] text-slate-300">
                                    {task.completedActivities}/
                                    {task.activityCount} Act.
                                </span>
                            </div>

                            <div className="mt-1 flex items-center gap-1.5">
                                <CalendarDays
                                    size={11}
                                    className="text-slate-400"
                                />

                                <span className="text-[10px] text-slate-300">
                                    {task.status === "COMPLETED"
                                        ? `Completed ${formattedDueDate}`
                                        : formattedDueDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add Activity */}
                    <button
                        type="button"
                        onClick={() => setAddActivityOpen(true)}
                        className="
                            mt-2
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-1
                            rounded-md
                            py-1
                            text-[10px]
                            font-medium
                            text-slate-400
                            transition
                            hover:bg-white/5
                            hover:text-cyan-300
                        "
                    >
                        <Plus size={11} />
                        Add
                    </button>
                </div>
            </div>

            {/* Activity modal */}
            {addActivityOpen && (
                <CreateEmployeeActivityModal
                    open={addActivityOpen}
                    onClose={() => setAddActivityOpen(false)}
                    onCreated={() => onChanged?.()}
                    defaultTaskId={task.id}
                />
            )}

            {/* Edit modal */}
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