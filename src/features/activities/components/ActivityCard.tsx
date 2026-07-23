"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Calendar,
    Flag,
    CheckCircle2,
    Pencil,
    Trash2,
    Square,
    CheckSquare,
} from "lucide-react";

import { AppDispatch, RootState } from "@/src/lib/store";
import { formatDate } from "@/src/lib/date";

import { Activity } from "../types";

import EditActivityModal from "./EditActivityModal";

import { deleteActivity as deleteActivityAPI, completeActivity } from "../api/activity.service";
import { deleteActivity, updateActivity as updateActivityRedux, } from "../store/activitySlice";

interface Props {
    activity: Activity;
    refresh: () => void;
}

export default function ActivityCard({
    activity,
    refresh,
}: Props) {

    const dispatch =
        useDispatch<AppDispatch>();

    const currentUserId =
        useSelector((state: RootState) => state.auth.user?.id);

    const isCreator = activity.createdById === currentUserId;
    const isAssignee = activity.assignedToId === currentUserId;

    const [open, setOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const handleDelete = async () => {

        const ok = window.confirm(
            "Delete this activity?"
        );

        if (!ok) return;

        try {

            setLoading(true);

            await deleteActivityAPI(
                activity.id
            );

            dispatch(
                deleteActivity(
                    activity.id
                )
            );

        } finally {

            setLoading(false);

        }

    };

    const handleComplete = async () => {

    if (activity.status === "COMPLETED") return;

    const updated =
        await completeActivity(activity.id);

    dispatch(
        updateActivityRedux(updated)
    );
    refresh();

};

    return (

        <>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition p-6">

                {/* Header */}

                <div className="flex justify-between">

                    <div>

                        <p className="text-xs text-slate-400 font-medium">

                            {activity.task?.title}

                        </p>

                        <h2 className="text-lg font-bold mt-1">

                            {activity.title}

                        </h2>

                        <p className="text-slate-500 mt-2">

                            {activity.description}

                        </p>

                    </div>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold h-fit">

                        {activity.status}

                    </span>

                </div>

                {/* Progress */}

                <div className="mt-6">

                    <div className="flex justify-between text-sm">

                        <span>
                            Progress
                        </span>

                        <span>
                            {activity.progress}%
                        </span>

                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-200">

                        <div

                            className="h-full rounded-full bg-emerald-500"

                            style={{
                                width: `${activity.progress}%`,
                            }}

                        />

                    </div>

                </div>

                {/* Details */}

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

                    <div className="flex items-center gap-2">

                        <Calendar size={16} />

                        {formatDate(activity.startDate)}

                    </div>

                    <div className="flex items-center gap-2">

                        <Flag size={16} />

                        {formatDate(activity.dueDate)}

                    </div>

                    <div className="flex items-center gap-2">

                        <CheckCircle2 size={16} />

                        {activity.priority}

                    </div>

                    <div>

                        Status

                        <span className="ml-2 font-semibold">

                            {activity.status}

                        </span>

                    </div>

                </div>

                {/* Mark Complete — assignee only */}
                {isAssignee && (
                    <div className="mt-6">

    <button
        onClick={handleComplete}
        disabled={activity.status === "COMPLETED"}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition
        ${
            activity.status === "COMPLETED"
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 text-white hover:bg-black"
        }`}
    >

        {activity.status === "COMPLETED"
            ? <CheckSquare size={18}/>
            : <Square size={18}/>}

        {activity.status === "COMPLETED"
            ? "Completed"
            : "Mark Complete"}

    </button>

</div>
                )}

                {/* Edit / Delete — creator only */}
                {isCreator && (
                    <div className="flex gap-3 mt-6">

                    <button

                        onClick={() => setOpen(true)}

                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"

                    >

                        <Pencil size={16} />

                        Edit

                    </button>

                    <button

                        onClick={handleDelete}

                        disabled={loading}

                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"

                    >

                        <Trash2 size={16} />

                        {loading
                            ? "Deleting..."
                            : "Delete"}

                    </button>

                </div>
                )}

            </div>

            <EditActivityModal

                open={open}

                activity={activity}

                onClose={() => setOpen(false)}

            />

        </>

    );

}
