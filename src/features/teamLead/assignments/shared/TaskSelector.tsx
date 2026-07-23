"use client";

import {

    useSelectableTasks

} from "./hooks/useSelectableTasks";

interface Props {

    goalId: string;

    value: string;

    onChange: (

        value: string

    ) => void;

}

export default function TaskSelector({

    goalId,

    value,

    onChange

}:Props){

    const{

        tasks,

        loading

    }=

    useSelectableTasks(

        goalId

    );

    return(

        <select

            value={value}

            disabled={

                !goalId ||

                loading

            }

            onChange={(e)=>

                onChange(

                    e.target.value

                )

            }

            className="w-full rounded-lg border p-3"

        >

            <option value="">

                {

                    goalId

                    ?

                    "Select Task"

                    :

                    "Select Goal First"

                }

            </option>

            {

                tasks.map(task=>(

                    <option

                        key={task.id}

                        value={task.id}

                    >

                        {task.title}

                        {" • "}
                        {task.assignedTo.fullName}

                    </option>

                ))

            }

        </select>

    );

}