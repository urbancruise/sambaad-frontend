"use client";

import EmployeeSelector from "../EmployeeSelector";
import GoalSelector from "../GoalSelector";
import TaskSelector from "../TaskSelector";

import PrioritySelect from "./PrioritySelect";
import StatusSelect from "./StatusSelect";
import DateRangeFields from "./DateRangeFields";
import HoursInput from "./HoursInput";

interface Props {

    values: any;

    onChange: (field: string, value: any) => void;

    showGoal?: boolean;

    showTask?: boolean;

}

export default function AssignmentForm({

    values,

    onChange,

    showGoal = true,

    showTask = false

}: Props) {

    return (

        <div className="space-y-4">

            <EmployeeSelector

                value={values.assignedToId}

                onChange={(v)=>onChange("assignedToId",v)}

            />

            {

                showGoal && (

                    <GoalSelector

                        value={values.goalId}

                        onChange={(v)=>onChange("goalId",v)}

                    />

                )

            }

            {

                showTask && (

                    <TaskSelector

                        goalId={values.goalId}

                        value={values.taskId}

                        onChange={(v)=>onChange("taskId",v)}

                    />

                )

            }

            <input

                placeholder="Title"

                value={values.title}

                onChange={(e)=>

                    onChange(

                        "title",

                        e.target.value

                    )

                }

                className="w-full rounded-lg border p-3"

            />

            <textarea

                placeholder="Description"

                value={values.description}

                onChange={(e)=>

                    onChange(

                        "description",

                        e.target.value

                    )

                }

                className="w-full rounded-lg border p-3"

            />

            <PrioritySelect

                value={values.priority}

                onChange={(v)=>onChange("priority",v)}

            />

            <StatusSelect

                value={values.status}

                onChange={(v)=>onChange("status",v)}

            />

            <DateRangeFields

                startDate={values.startDate}

                dueDate={values.dueDate}

                onStartChange={(v)=>onChange("startDate",v)}

                onDueChange={(v)=>onChange("dueDate",v)}

            />

            <HoursInput

                value={values.estimatedHours}

                onChange={(v)=>

                    onChange(

                        "estimatedHours",

                        v

                    )

                }

            />

        </div>

    );

}