"use client";

import { useState } from "react";

import TeamMemberSelector from "./common/TeamMemberSelector";
import PrioritySelect from "./common/PrioritySelect";
import DateRangePicker from "./common/DateRangePicker";
import SubmitButton from "./common/SubmitButton";

interface Props {

    goalId: string;

    loading: boolean;

    onSubmit: (data: any) => void;

}

export default function TaskForm({

    goalId,

    loading,

    onSubmit

}: Props) {

    const [form, setForm] = useState({

        goalId,

        title: "",

        description: "",

        assignedToId: "",

        priority: "MEDIUM",

        estimatedHours: "",

        startDate: "",

        dueDate: ""

    });

    return (

        <form

            className="space-y-4"

            onSubmit={(e) => {

                e.preventDefault();

                onSubmit(form);

            }}

        >

            <input

                placeholder="Task title"

                value={form.title}

                onChange={(e)=>

                    setForm({

                        ...form,

                        title:e.target.value

                    })

                }

            />

            <textarea

                placeholder="Description"

                value={form.description}

                onChange={(e)=>

                    setForm({

                        ...form,

                        description:e.target.value

                    })

                }

            />

            <TeamMemberSelector

                value={form.assignedToId}

                onChange={(value)=>

                    setForm({

                        ...form,

                        assignedToId:value

                    })

                }

            />

            <PrioritySelect

                value={form.priority}

                onChange={(value)=>

                    setForm({

                        ...form,

                        priority:value

                    })

                }

            />

            <input

                type="number"

                placeholder="Estimated Hours"

                value={form.estimatedHours}

                onChange={(e)=>

                    setForm({

                        ...form,

                        estimatedHours:e.target.value

                    })

                }

            />

            <DateRangePicker

                startDate={form.startDate}

                dueDate={form.dueDate}

                onStartChange={(value)=>

                    setForm({

                        ...form,

                        startDate:value

                    })

                }

                onDueChange={(value)=>

                    setForm({

                        ...form,

                        dueDate:value

                    })

                }

            />

            <SubmitButton

                loading={loading}

                title="Create Task"

            />

        </form>

    );

}