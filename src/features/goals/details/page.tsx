"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getGoalById } from "../api/goal.service";
import { getTasks } from "@/src/features/tasks/api/task.service";

import { Goal } from "../types";
import { Task } from "@/src/features/tasks/types";

import GoalInfo from "./GoalInfo";
import TaskList from "./TaskList";

export default function GoalDetailsPage() {

    const { goalId } =
        useParams();

    const [goal, setGoal] =
        useState<Goal>();

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadData();

    }, [goalId]);

const loadData = async () => {

    try {

        setLoading(true);

        const goalData =
            await getGoalById(goalId as string);

        setGoal(goalData);

        const taskData =
            await getTasks({
                goalId,
            });

        setTasks(taskData.tasks);

    } finally {

        setLoading(false);

    }

};

    if (loading) {

        return (
            <div className="py-20 text-center">

                Loading...

            </div>
        );

    }

    if (!goal) {

        return (
            <div className="py-20 text-center">

                Goal not found

            </div>
        );

    }

    return (

        <div className="space-y-8">

            <GoalInfo goal={goal} />

            <TaskList
                goalId={goal.id}
                tasks={tasks}
            />

        </div>

    );

}