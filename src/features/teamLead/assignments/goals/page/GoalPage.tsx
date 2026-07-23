"use client";

import { useMemo, useState } from "react";

import GoalFilters from "../components/GoalFilters";
import GoalModal from "../components/GoalModal";
import GoalTable from "../components/GoalTable";

import { useGoals } from "../hooks/useGoals";
import { createGoal } from "../api/goal.service";

export default function GoalPage() {

    const {

        goals,

        refresh

    } = useGoals();

    const [search,setSearch]=useState("");

    const [open,setOpen]=useState(false);

    const filteredGoals=useMemo(()=>{

        return goals.filter(goal=>

            goal.title

            .toLowerCase()

            .includes(

                search.toLowerCase()

            )

        );

    },[goals,search]);

    return(

        <div className="space-y-6">

            <GoalFilters

                search={search}

                onSearch={setSearch}

                onCreate={()=>setOpen(true)}

            />

            <GoalTable

                goals={filteredGoals}

                onEdit={(goal)=>console.log(goal)}

                onDelete={(goal)=>console.log(goal)}

            />

            <GoalModal

                open={open}

                onClose={()=>setOpen(false)}

                onSubmit={async(data)=>{

                    await createGoal(data);

                    setOpen(false);

                    refresh();

                }}

            />

        </div>

    );

}