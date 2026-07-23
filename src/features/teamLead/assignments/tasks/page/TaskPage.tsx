"use client";

import { useMemo, useState } from "react";

import TaskFilters from "../components/TaskFilters";
import TaskModal from "../components/TaskModal";
import TaskTable from "../components/TaskTable";

import { useTasks } from "../hooks/useTasks";
import { createTask } from "../api/task.service";

export default function TaskPage(){

    const{

        tasks,

        refresh

    }=useTasks();

    const[search,setSearch]=useState("");

    const[open,setOpen]=useState(false);

    const filtered=useMemo(()=>{

        return tasks.filter(task=>

            task.title

            .toLowerCase()

            .includes(

                search.toLowerCase()

            )

        );

    },[tasks,search]);

    return(

        <div className="space-y-6">

            <TaskFilters

                search={search}

                onSearch={setSearch}

                onCreate={()=>setOpen(true)}

            />

            <TaskTable

                tasks={filtered}

                onEdit={(task)=>console.log(task)}

                onDelete={(task)=>console.log(task)}

            />

            <TaskModal

                open={open}

                onClose={()=>setOpen(false)}

                onSubmit={async(data)=>{

                    await createTask(data);

                    setOpen(false);

                    refresh();

                }}

            />

        </div>

    );

}