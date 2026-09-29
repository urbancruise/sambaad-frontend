"use client";

import { useState } from "react";

import { useSelector } from "react-redux";

import { Pencil, Trash2 } from "lucide-react";

import { RootState } from "@/src/lib/store";

import { EmployeeActivity } from "../types";

import EditEmployeeActivityModal from "./EditEmployeeActivityModal";

import { deleteEmployeeActivity } from "../api/activity.services";

interface Props {
    activity: EmployeeActivity;
    onChanged?: () => void;
}

const statusColor = {
    PENDING: "bg-slate-700/80 text-slate-200 border-slate-500/50",
    IN_PROGRESS: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    COMPLETED: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    CANCELLED: "bg-red-500/20 text-red-200 border-red-400/30",
};

const priorityColor = {
    LOW: "bg-slate-600/80 text-slate-200",
    MEDIUM: "bg-yellow-500/20 text-yellow-200",
    HIGH: "bg-orange-500/20 text-orange-200",
    CRITICAL: "bg-red-500/20 text-red-200",
};

export default function ActivityCard({
    activity,
    onChanged,
}: Props) {
    const currentUserId = useSelector(
        (state: RootState) => state.auth.user?.id
    );

    const isCreator = activity.createdById === currentUserId;

    const [editOpen, setEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const progress = Math.min(
        100,
        Math.max(0, Number(activity.progress ?? 0))
    );

    const handleDelete = async () => {
        const ok = window.confirm("Delete this activity?");

        if (!ok) return;

        try {
            setDeleting(true);

            await deleteEmployeeActivity(activity.id);

            onChanged?.();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div
                className="
                    group
                    relative
                    min-h-[138px]
                    w-full
                    overflow-hidden
                    rounded-[18px]
                    border
                    border-slate-300
                    bg-gradient-to-br
                    from-[#55585d]
                    via-[#35383d]
                    to-[#1d2024]
                    p-[6px]
                    shadow-[0_8px_20px_rgba(0,0,0,0.28)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_25px_rgba(0,0,0,0.35)]
                "
            >
                {/* Inner metallic border */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-[3px]
                        rounded-[15px]
                        border
                        border-white/20
                    "
                />

                {/* Main card */}
                <div
                    className="
                        relative
                        flex
                        h-full
                        min-h-[126px]
                        rounded-[13px]
                        bg-gradient-to-br
                        from-[#292c31]
                        via-[#22252a]
                        to-[#191c20]
                        px-2.5
                        py-2
                        text-white
                    "
                >
                    {/* LEFT CONTENT */}
                    <div className="flex min-w-0 flex-1 flex-col pr-2">
                        {/* Top row */}
                        <div className="flex items-center gap-1.5">
                            {/* Priority */}
                            <span
                                className={`
                                    rounded-md
                                    px-2
                                    py-[3px]
                                    text-[9px]
                                    font-semibold
                                    leading-none
                                    tracking-wide
                                    ${priorityColor[
                                        activity.priority as keyof typeof priorityColor
                                    ]}
                                `}
                            >
                                {activity.priority}
                            </span>

                            {/* Status */}
                            <span
                                className={`
                                    rounded-md
                                    border
                                    px-2
                                    py-[3px]
                                    text-[9px]
                                    font-medium
                                    leading-none
                                    ${statusColor[
                                        activity.status as keyof typeof statusColor
                                    ]}
                                `}
                            >
                                {activity.status}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="mt-2 min-w-0">
                            <h2
                                className="
                                    truncate
                                    text-[15px]
                                    font-medium
                                    leading-tight
                                    text-white
                                "
                                title={activity.title}
                            >
                                {activity.title}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-[9px]
                                    leading-tight
                                    text-slate-300
                                "
                                title={activity.goal?.title}
                            >
                                Goal : {activity.goal?.title || "-"}
                            </p>

                            <p
                                className="
                                    mt-[2px]
                                    truncate
                                    text-[9px]
                                    leading-tight
                                    text-slate-300
                                "
                                title={activity.task?.title}
                            >
                                Task : {activity.task?.title || "-"}
                            </p>
                        </div>

                        {/* Progress label */}
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-200">
                                Progress
                            </span>

                            <span className="text-[10px] font-semibold text-slate-300">
                                {progress}%
                            </span>
                        </div>

                        {/* Bottom stats */}
                        <div className="mt-1.5 flex gap-1.5">
                            {/* Estimated */}
                            <div
                                className="
                                    min-w-[68px]
                                    rounded-md
                                    border
                                    border-white/10
                                    bg-black/20
                                    px-2
                                    py-1
                                "
                            >
                                <p className="text-[8px] text-slate-400">
                                    Estimated
                                </p>

                                <p className="mt-[1px] text-[10px] font-medium text-white">
                                    {activity.estimatedMinutes ?? "-"} min
                                </p>
                            </div>

                            {/* Actual */}
                            <div
                                className="
                                    min-w-[58px]
                                    rounded-md
                                    border
                                    border-white/10
                                    bg-black/20
                                    px-2
                                    py-1
                                "
                            >
                                <p className="text-[8px] text-slate-400">
                                    Actual
                                </p>

                                <p className="mt-[1px] text-[10px] font-medium text-white">
                                    {activity.actualMinutes ?? 0} min
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="relative flex w-[72px] shrink-0 flex-col items-center">
                        {/* Action buttons */}
                        {isCreator && (
                            <div
                                className="
                                    absolute
                                    right-0
                                    top-0
                                    z-20
                                    flex
                                    items-center
                                    gap-1
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(true)}
                                    title="Edit activity"
                                    className="
                                        rounded-md
                                        border
                                        border-white/10
                                        bg-white/10
                                        p-1
                                        text-slate-300
                                        transition
                                        hover:bg-emerald-500/20
                                        hover:text-emerald-300
                                    "
                                >
                                    <Pencil size={10} />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    title="Delete activity"
                                    className="
                                        rounded-md
                                        border
                                        border-white/10
                                        bg-white/10
                                        p-1
                                        text-slate-300
                                        transition
                                        hover:bg-red-500/20
                                        hover:text-red-300
                                        disabled:opacity-40
                                    "
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        )}

                        {/* Circular Progress Gauge */}
                        <div className="relative mt-6 h-[58px] w-[58px]">
                            {/* Outer ring */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-full
                                    bg-[#292c30]
                                    shadow-[inset_0_2px_5px_rgba(255,255,255,0.12),inset_0_-3px_7px_rgba(0,0,0,0.7)]
                                "
                            />

                            {/* Progress ring */}
                            <div
                                className="
                                    absolute
                                    inset-[4px]
                                    rounded-full
                                "
                                style={{
                                    background: `conic-gradient(
                                        ${
                                            activity.status === "COMPLETED"
                                                ? "#86efac"
                                                : "#f4e7a0"
                                        } ${progress * 3.6}deg,
                                        transparent ${progress * 3.6}deg
                                    )`,
                                }}
                            />

                            {/* Gauge center */}
                            <div
                                className="
                                    absolute
                                    inset-[9px]
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-gradient-to-br
                                    from-[#666970]
                                    via-[#45484d]
                                    to-[#272a2e]
                                    shadow-[inset_2px_2px_5px_rgba(255,255,255,0.15),inset_-3px_-3px_6px_rgba(0,0,0,0.7)]
                                "
                            >
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-slate-100
                                    "
                                >
                                    {progress}%
                                </span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="mt-2 text-center">
                            <p className="text-[8px] uppercase text-slate-500">
                                {activity.dueDate
                                    ? new Date(
                                          activity.dueDate
                                      ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "2-digit",
                                          year: "numeric",
                                      })
                                    : "No Date"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/*
                Keep your commented code as requested:

                <div>
                    <p className="text-sm text-slate-500">
                        Started
                    </p>
                    <p className="font-semibold">
                        {
                            activity.startedAt
                            ? new Date(activity.startedAt).toLocaleDateString()
                            : "-"
                        }
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Due
                    </p>
                    <p className="font-semibold">
                        {
                            activity.dueDate
                            ? new Date(activity.dueDate).toLocaleDateString()
                            : "-"
                        }
                    </p>
                </div>
            */}

            {isCreator && (
                <EditEmployeeActivityModal
                    open={editOpen}
                    activity={activity}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => onChanged?.()}
                />
            )}
        </>
    );
}