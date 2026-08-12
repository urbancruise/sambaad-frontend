"use client";
import EmployeeSelector
from "../../shared/EmployeeSelector";
import { useState } from "react";

interface Props {

    open: boolean;

    onClose: () => void;

    onSubmit: (data: any) => void;

}

export default function GoalModal({

    open,

    onClose,

    onSubmit

}: Props) {

    const [form,setForm]=useState({
        assignedToId:"",
        title:"",
        description:"",
        priority:"MEDIUM",
        status: "PENDING",
        startDate:"",
        dueDate:"",
        estimatedHours:""
    });

    if(!open) return null;

    return(

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-xl md:min-w-[500px] rounded-2xl bg-white p-6">

                <h2 className="mb-6 text-2xl font-bold">

                    Assign Goal

                </h2>

                <div className="space-y-4">

                    <EmployeeSelector

    value={form.assignedToId}

    onChange={(value)=>

        setForm({

            ...form,

            assignedToId:value

        })

    }

/>

                    <input

                        placeholder="Goal Title"

                        className="w-full rounded-lg border p-3"

                        value={form.title}

                        onChange={(e)=>setForm({

                            ...form,

                            title:e.target.value

                        })}

                    />

                    <textarea

                        placeholder="Description"

                        className="w-full rounded-lg border p-3"

                        value={form.description}

                        onChange={(e)=>setForm({

                            ...form,

                            description:e.target.value

                        })}

                    />

                    <select

                        className="w-full rounded-lg border p-3"

                        value={form.priority}

                        onChange={(e)=>setForm({

                            ...form,

                            priority:e.target.value

                        })}

                    >

                        <option>LOW</option>

                        <option>MEDIUM</option>

                        <option>HIGH</option>

                        <option>CRITICAL</option>

                    </select>

                    <input

                        type="date"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>setForm({

                            ...form,

                            startDate:e.target.value

                        })}

                    />

                    <input

                        type="date"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>setForm({

                            ...form,

                            dueDate:e.target.value

                        })}

                    />

                    <input

                        type="number"

                        placeholder="Estimated Hours"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>setForm({

                            ...form,

                            estimatedHours:e.target.value

                        })}

                    />

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-lg border px-4 py-2"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={()=>onSubmit(form)}

                        className="rounded-lg bg-slate-900 px-5 py-2 text-white"

                    >

                        Assign Goal

                    </button>

                </div>

            </div>

        </div>

    );

}
