"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { getActivities } from "@/src/features/activities/api/activity.service";
import { Activity } from "@/src/features/activities/types";

import ActivityCard from "@/src/features/activities/components/ActivityCard";
import CreateActivityModal from "@/src/features/activities/components/CreateActivityModal";

interface Props {
    taskId: string;
}

export default function ActivityList({
    taskId,
}: Props) {

    const [activities, setActivities] =
        useState<Activity[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [open, setOpen] =
        useState(false);

    useEffect(() => {

        loadActivities();

    }, [taskId]);

    const loadActivities = async () => {

        try {

            setLoading(true);

            const data =
                await getActivities({
                    taskId,
                });

            setActivities(data.activities);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="py-6 text-center text-slate-500">

                Loading activities...

            </div>
        );

    }

    return (

        <div className="space-y-5">

            <div className="flex justify-between items-center">

                <h3 className="font-bold text-lg">

                    Activities

                </h3>

                <button

                    onClick={() => setOpen(true)}

                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700"

                >

                    <Plus size={16} />

                    Create Activity

                </button>

            </div>

            {activities.length === 0 && (

                <div className="border border-dashed rounded-xl p-8 text-center text-slate-500">

                    No Activities Found

                </div>

            )}

            <div className="space-y-4">

                {/* {activities.map((activity) => (

                    <ActivityCard

                        key={activity.id}

                        activity={activity}

                    />

                ))} */}

            </div>

            <CreateActivityModal

                open={open}
                taskId={taskId}

                onClose={() => {

                    setOpen(false);

                    loadActivities();

                }}

            />

        </div>

    );

}