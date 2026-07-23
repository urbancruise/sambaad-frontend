"use client";

import { useState } from "react";

import TeamMemberSelector from "./common/TeamMemberSelector";

interface Props {

    onSubmit: (data: any) => void;

    loading: boolean;

}

export default function GoalForm({

    onSubmit,

    loading

}: Props) {

    const [form, setForm] = useState({

        title: "",

        description: "",

        assignedToId: "",

        goalType: "ONGOING",

        priority: "MEDIUM",

        startDate: "",

        dueDate: ""

    });

    return (

        <form
            onSubmit={(e) => {

                e.preventDefault();

                onSubmit(form);

            }}
            className="space-y-4"
        >

            <input

                placeholder="Goal Title"

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

                onChange={(id)=>

                    setForm({

                        ...form,

                        assignedToId:id

                    })

                }

            />

            <button
                disabled={loading}
            >

                Create Goal

            </button>

        </form>

    );

}