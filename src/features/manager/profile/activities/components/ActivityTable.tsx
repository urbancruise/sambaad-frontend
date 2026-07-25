"use client";

import ActivityCard from "./ActivityCard";

import { EmployeeActivity } from "../types";

interface Props {

    activities: EmployeeActivity[];

    loading: boolean;

    onChanged?: () => void;

}

export default function ActivityTable({

    activities,

    loading,

    onChanged

}: Props) {

    if (loading) {

        return (

            <div className="rounded-xl border bg-white p-10 text-center">

                Loading activities...

            </div>

        );

    }

    if (!activities.length) {

        return (

            <div className="rounded-xl border border-dashed p-12 text-center">

                No Activities Found

            </div>

        );

    }

    return (

        <div className="grid gap-6 lg:grid-cols-2">

            {

                activities.map(activity => (

                    <ActivityCard

                        key={activity.id}

                        activity={activity}

                        onChanged={onChanged}

                    />

                ))

            }

        </div>

    );

}
