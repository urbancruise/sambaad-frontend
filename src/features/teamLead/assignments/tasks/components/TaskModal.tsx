"use client";

import { useState } from "react";

import EmployeeSelector from "../../shared/EmployeeSelector";
import GoalSelector from "../../shared/EmployeeSelector";

interface Props{

    open:boolean;

    onClose:()=>void;

    onSubmit:(data:any)=>void;

}

export default function TaskModal({

    open,

    onClose,

    onSubmit

}:Props){

    const [form,setForm]=useState({

        goalId:"",

        assignedToId:"",

        title:"",

        description:"",

        priority:"MEDIUM",

        startDate:"",

        dueDate:"",

        estimatedHours:""

    });

    if(!open) return null;

    return(

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="w-full max-w-xl rounded-2xl bg-white p-6">

                <h2 className="mb-6 text-2xl font-bold">

                    Assign Task

                </h2>

                <div className="space-y-4">

                    <GoalSelector

                        value={form.goalId}

                        onChange={(goalId)=>

                            setForm({

                                ...form,

                                goalId

                            })

                        }

                    />

                    <EmployeeSelector

                        value={form.assignedToId}

                        onChange={(assignedToId)=>

                            setForm({

                                ...form,

                                assignedToId

                            })

                        }

                    />

                    <input

                        placeholder="Task Title"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>

                            setForm({

                                ...form,

                                title:e.target.value

                            })

                        }

                    />

                    <textarea

                        placeholder="Description"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>

                            setForm({

                                ...form,

                                description:e.target.value

                            })

                        }

                    />

                    <select

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>

                            setForm({

                                ...form,

                                priority:e.target.value

                            })

                        }

                    >

                        <option>LOW</option>

                        <option>MEDIUM</option>

                        <option>HIGH</option>

                        <option>CRITICAL</option>

                    </select>

                    <input

                        type="date"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>

                            setForm({

                                ...form,

                                startDate:e.target.value

                            })

                        }

                    />

                    <input

                        type="date"

                        className="w-full rounded-lg border p-3"

                        onChange={(e)=>

                            setForm({

                                ...form,

                                dueDate:e.target.value

                            })

                        }

                    />

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-lg border px-5 py-2"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={()=>onSubmit(form)}

                        className="rounded-lg bg-slate-900 px-5 py-2 text-white"

                    >

                        Assign Task

                    </button>

                </div>

            </div>

        </div>

    );

}