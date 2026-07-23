"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    activitySchema,
    ActivityFormValues,
} from "../schema/activity.schema";

import { Task } from "@/src/features/tasks/types";

interface ActivityFormProps {

    tasks: Task[];

    defaultValues?: Partial<ActivityFormValues>;

    loading?: boolean;

    onSubmit: (
        values: ActivityFormValues
    ) => Promise<void>;

}

export default function ActivityForm({

    tasks,
    defaultValues,
    loading,
    onSubmit,

}: ActivityFormProps) {

    const {

        register,

        handleSubmit,

        formState: { errors },

    } = useForm<ActivityFormValues>({

        resolver: zodResolver(activitySchema),

        defaultValues,

    });

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

            {/* Task */}

            <div>

                <label className="block text-sm text-black  font-semibold mb-2">

                    Task

                </label>

                <select
                    {...register("taskId")}
                    className="w-full rounded-xl text-black border border-slate-300 px-4 py-3"
                >

                    <option value="">
                        Select Task
                    </option>

                    {tasks.map((task) => (

                        <option className="text-black"
                            key={task.id}
                            value={task.id}
                        >
                            {task.title}
                        </option>

                    ))}

                </select>

                <p className="text-xs text-red-500 mt-1">

                    {errors.taskId?.message}

                </p>

            </div>

            {/* Title */}

            <div>

                <label className="block text-sm text-black font-semibold mb-2">

                    Activity Title

                </label>

                <input

                    {...register("title")}

                    placeholder="Design Login UI"

                    className="w-full rounded-xl border text-black border-slate-300 px-4 py-3"

                />

                <p className="text-xs text-red-500 mt-1">

                    {errors.title?.message}

                </p>

            </div>

            {/* Description */}

            {/* <div>

                <label className="block text-sm font-semibold mb-2">

                    Description

                </label>

                <textarea

                    rows={4}

                    {...register("description")}

                    className="w-full rounded-xl border border-slate-300 px-4 py-3"

                />

            </div> */}

            {/* Priority */}

            {/* <div>

                <label className="block text-sm font-semibold mb-2">

                    Priority

                </label>

                <select

                    {...register("priority")}

                    className="w-full rounded-xl border border-slate-300  px-4 py-3 "
                >
                    <option className="text-red-400" value="LOW">
                        Low
                    </option>

                    <option className="text-red-600" value="MEDIUM">
                        Medium
                    </option>

                    <option className="text-red-700" value="HIGH">
                        High
                    </option>

                    <option className="text-red-900" value="CRITICAL">
                        Critical
                    </option>

                </select>

            </div> */}

            {/* Dat`es */}

            {/* <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="block text-sm font-semibold mb-2">

                        Start Date

                    </label>

                    <input

                        type="date"

                        {...register("startDate")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

                <div>

                    <label className="block text-sm font-semibold mb-2">

                        Due Date

                    </label>

                    <input

                        type="date"

                        {...register("dueDate")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

            </div> */}

            <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-emerald-600 text-black py-3 font-semibold hover:bg-emerald-700 transition"

            >

                {loading
                    ? "Saving..."
                    : "Save Activity"}

            </button>

        </form>

    );

}