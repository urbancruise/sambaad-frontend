"use client";

import { Achievement } from "../../types";
import { formatDate } from "@/src/lib/date";

interface Props {
    achievements: Achievement[];
}

export default function AchievementCard({
    achievements,
}: Props) {

    return (

        <div className="bg-white rounded-2xl border p-6">

            <h2 className="text-xl font-bold mb-5">

                Achievements

            </h2>

            <div className="space-y-4">

                {achievements.length === 0 && (

                    <div className="text-slate-500">

                        No achievements yet

                    </div>

                )}

                {achievements.map(item => (

                    <div
                        key={item.id}
                        className="border rounded-xl p-4"
                    >

                        <h3 className="font-semibold">

                            {item.title}

                        </h3>

                        <p className="text-slate-500 text-sm mt-2">

                            {item.description}

                        </p>

                        <p className="text-xs mt-3">

                            {formatDate(item.createdAt)}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}