"use client";

import {

    useSelectableGoals

} from "./hooks/useSelectableGoals";

interface Props {

    value: string;

    onChange: (

        value: string

    ) => void;

}

export default function GoalSelector({

    value,

    onChange

}: Props){

    const {

        goals,

        loading

    } = useSelectableGoals();

    return(

        <select

            value={value}

            disabled={loading}

            onChange={(e)=>

                onChange(

                    e.target.value

                )

            }

            className="w-full rounded-lg border p-3"

        >

            <option value="">

                Select Goal

            </option>

            {

                goals.map(goal=>(

                    <option

                        key={goal.id}

                        value={goal.id}

                    >

                        {goal.title}

                        {" • "}
                        {goal.assignedTo.fullName}

                    </option>

                ))

            }

        </select>

    );

}