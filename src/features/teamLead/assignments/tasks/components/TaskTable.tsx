"use client";

import TaskCard from "./TaskCard";

import { TeamTask } from "../type";

interface Props {

    tasks: TeamTask[];

    onEdit: (task: TeamTask) => void;

    onDelete: (task: TeamTask) => void;

}

export default function TaskTable({

    tasks,

    onEdit,

    onDelete

}: Props){

    if(!tasks.length){

        return(

            <div className="rounded-xl border border-dashed p-10 text-center">

                No Tasks Found

            </div>

        );

    }

    return(

        <div className="grid lg:grid-cols-2 gap-6">

            {

                tasks.map(task=>(

                    <TaskCard

                        key={task.id}

                        task={task}

                        onEdit={onEdit}

                        onDelete={onDelete}

                    />

                ))

            }

        </div>

    );

}