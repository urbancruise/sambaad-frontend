"use client";

import GoalCard from "./GoalCard";
import { TeamGoal } from "../types";

interface Props {

    goals: TeamGoal[];

    onEdit: (goal: TeamGoal) => void;

    onDelete: (goal: TeamGoal) => void;

}

export default function GoalTable({

    goals,

    onEdit,

    onDelete

}: Props) {

    if (!goals.length) {

        return (

            <div className="rounded-xl border border-dashed p-12 text-center">

                No Goals Found

            </div>

        );

    }

    return (

        <div className="grid gap-6 lg:grid-cols-2">

            {

                goals.map(goal => (

                    <GoalCard

                        key={goal.id}

                        goal={goal}

                        onEdit={onEdit}

                        onDelete={onDelete}

                    />

                ))

            }

        </div>

    );

}