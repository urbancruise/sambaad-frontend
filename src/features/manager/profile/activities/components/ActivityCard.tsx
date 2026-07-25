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

export default function ActivityCard({

    activity,
    onChanged

}: Props) {

    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const isCreator = activity.createdById === currentUserId;

    const [editOpen, setEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-lg font-semibold">

                        {activity.title}

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Goal : {activity.goal.title}

                    </p>

                    <p className="text-sm text-slate-500">

                        Task : {activity.task.title}

                    </p>

                </div>

                <div className="flex items-start gap-2">

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor[activity.priority as keyof typeof priorityColor]}`}>

                        {activity.priority}

                    </span>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[activity.status as keyof typeof statusColor]}`}>

                        {activity.status}

                    </span>

                    {/* Action buttons — creator only */}
                    {isCreator && (
                        <div className="flex items-center gap-1 ml-1">
                            <button
                                onClick={() => setEditOpen(true)}
                                title="Edit activity"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                title="Delete activity"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    )}

                </div>

            </div>

            <div className="mt-5">

                <div className="mb-2 flex justify-between">

                    <span>Progress</span>

                    <span>{activity.progress}%</span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                    <div

                        className="h-full bg-emerald-500"

                        style={{

                            width: `${activity.progress}%`

                        }}

                    />

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">

                <div>

                    <p className="text-sm text-slate-500">

                        Estimated

                    </p>

                    <p className="font-semibold">

                        {activity.estimatedMinutes ?? "-"} min

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Actual

                    </p>

                    <p className="font-semibold">

                        {activity.actualMinutes ?? 0} min

                    </p>

                </div>

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

            </div>

            {isCreator && (
                <EditEmployeeActivityModal
                    open={editOpen}
                    activity={activity}
                    onClose={() => setEditOpen(false)}
                    onUpdated={() => onChanged?.()}
                />
            )}

        </div>

    );

}
