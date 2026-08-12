"use client";

import { Goal } from "../types";

import GoalHeader from "./GoalHeader";

interface Props {
    goal: Goal;
}

export default function GoalCard({
    goal,
}: Props) {

    return (

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:shadow-lg transition">

            <GoalHeader goal={goal} />

        </div>

    );

}
