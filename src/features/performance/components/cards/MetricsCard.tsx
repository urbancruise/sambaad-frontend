"use client";

import { PerformanceMetrics } from "../../types";

interface Props {
    metrics: PerformanceMetrics;
}

export default function MetricsCard({
    metrics,
}: Props) {

    const items = [

        {
            title: "Goals",
            total: metrics.goals,
            completed: metrics.completedGoals,
        },

        {
            title: "Tasks",
            total: metrics.tasks,
            completed: metrics.completedTasks,
        },

        {
            title: "Activities",
            total: metrics.activities,
            completed: metrics.completedActivities,
        },

        {
            title: "On Time",
            total: metrics.completedActivities,
            completed: metrics.onTimeActivities,
        },

    ];

    return (

        <div className="grid md:grid-cols-4 gap-5">

            {items.map(item => (

                <div
                    key={item.title}
                    className="bg-white rounded-xl border p-6"
                >

                    <h3 className="font-semibold">

                        {item.title}

                    </h3>

                    <div className="mt-5 flex justify-between">

                        <span>Total</span>

                        <span>{item.total}</span>

                    </div>

                    <div className="flex justify-between mt-2">

                        <span>Completed</span>

                        <span>{item.completed}</span>

                    </div>

                </div>

            ))}

        </div>

    );

}