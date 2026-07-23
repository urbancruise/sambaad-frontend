"use client";

import { PerformanceScores } from "../../types";

interface Props {
    scores: PerformanceScores;
}

export default function ScoreCard({
    scores,
}: Props) {

    const cards = [

        {
            title: "Goal",
            value: scores.goalScore,
        },

        {
            title: "Task",
            value: scores.taskScore,
        },

        {
            title: "Activity",
            value: scores.activityScore,
        },

        {
            title: "On Time",
            value: scores.onTimeScore,
        },

        {
            title: "Productivity",
            value: scores.productivityScore,
        },

    ];

    return (

        <div className="space-y-6">

            <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-8 text-white">

                <h2 className="text-lg">

                    Overall Performance

                </h2>

                <p className="text-5xl font-bold mt-3">

                    {scores.performanceScore}

                </p>

            </div>

            <div className="grid md:grid-cols-5 gap-4">

                {cards.map(card => (

                    <div
                        key={card.title}
                        className="bg-white rounded-xl border p-5 text-center"
                    >

                        <p className="text-slate-500">

                            {card.title}

                        </p>

                        <h2 className="text-3xl font-bold mt-2">

                            {card.value}

                        </h2>

                    </div>

                ))}

            </div>

        </div>

    );

}