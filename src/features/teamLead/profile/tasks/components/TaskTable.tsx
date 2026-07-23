"use client";

import TaskCard from "./TaskCard";

import { EmployeeTask } from "../type";

interface Props {

    tasks: EmployeeTask[];

    loading: boolean;

    onChanged?: () => void;

}

export default function TaskTable({

    tasks,

    loading,

    onChanged

}: Props) {

    if (loading) {

        return (

            <div className="rounded-xl bg-white border p-10 text-center">

                Loading tasks...

            </div>

        );

    }

    if (!tasks.length) {

        return (

            <div className="rounded-xl border border-dashed p-12 text-center">

                No Tasks Found

            </div>

        );

    }

    return (

        <div className="grid gap-6 lg:grid-cols-2">

            {

                tasks.map(task => (

                    <TaskCard

                        key={task.id}

                        task={task}

                        onChanged={onChanged}

                    />

                ))

            }

        </div>

    );

}
