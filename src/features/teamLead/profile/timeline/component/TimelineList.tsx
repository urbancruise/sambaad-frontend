"use client";

import TimelineItem from "./TimelineItem";

import { EmployeeTimeline } from "../types";

interface Props {

    timeline: EmployeeTimeline[];

    loading: boolean;

}

export default function TimelineList({

    timeline,

    loading

}: Props) {

    if (loading) {

        return (

            <div className="rounded-xl border bg-white p-10 text-center">

                Loading timeline...

            </div>

        );

    }

    if (!timeline.length) {

        return (

            <div className="rounded-xl border border-dashed p-12 text-center">

                No Timeline Available

            </div>

        );

    }

    return (

        <div className="space-y-6">

            {

                timeline.map(item => (

                    <TimelineItem

                        key={item.id}

                        item={item}

                    />

                ))

            }

        </div>

    );

}