"use client";

import { useState } from "react";

import TeamMemberSelector from "./common/TeamMemberSelector";
import PrioritySelect from "./common/PrioritySelect";
import DateRangePicker from "./common/DateRangePicker";
import SubmitButton from "./common/SubmitButton";

interface Props {

    taskId: string;

    loading: boolean;

    onSubmit: (data: any) => void;

}

export default function ActivityForm({

    taskId,

    loading,

    onSubmit

}: Props) {

    const [form, setForm] = useState({

        taskId,

        title: "",

        description: "",

        assignedToId: "",

        priority: "MEDIUM",

        estimatedMinutes: "",

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

                placeholder="Activity Title"

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

                placeholder="Estimated Minutes"

                value={form.estimatedMinutes}

                onChange={(e)=>

                    setForm({

                        ...form,

                        estimatedMinutes:e.target.value

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

                title="Create Activity"

            />

        </form>

    );

}