"use client";

import { Goal } from "../types";
import GoalCard from "./GoalCard";

interface Props {
    goals: Goal[];
}

export default function GoalList({
    goals,
}: Props) {

    if (goals.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                No goals found.
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {goals.map((goal) => (
                <GoalCard
                    key={goal.id}
                    goal={goal}
                />
            ))}
        </div>
    );
}