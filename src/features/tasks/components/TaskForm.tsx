"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    taskSchema,
    TaskFormValues,
} from "../schema/task.schema";

import { Goal } from "@/src/features/goals/types";

interface TaskFormProps {

    goals: Goal[];

    defaultValues?: Partial<TaskFormValues>;

    loading?: boolean;
    defaultGoalId?: string;

    onSubmit: (
        values: TaskFormValues
    ) => Promise<void>;

}

export default function TaskForm({

    goals,

    defaultValues,

    defaultGoalId,

    loading,

    onSubmit,

}: TaskFormProps) {
const {

    register,

    handleSubmit,

    formState: { errors },

} = useForm<TaskFormValues>({

    resolver: zodResolver(taskSchema),

    defaultValues: {

        goalId: defaultGoalId,

        ...defaultValues,

    },

});

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

          {!defaultGoalId && (

    <div>

        <label className="block text-sm font-semibold text-black mb-2">

            Goal

        </label>

        <select
            {...register("goalId")}
            className="w-full rounded-xl border text-black  border-slate-300 px-4 py-3"
        >

            <option className="text-black" value="">
                Select Goal
            </option>

            {goals.map((goal) => (

                <option
                    key={goal.id}
                    value={goal.id}
                    className="text-black capitalize"
                >
                    {goal.title}
                </option>

            ))}

        </select>

        <p className="text-xs text-red-500 mt-1">

            {errors.goalId?.message}

        </p>

    </div>

)}

            {/* Title */}

            <div>

                <label className="block text-sm text-black  font-semibold mb-2">

                    Task Title

                </label>

                <input
                    {...register("title")}
                    placeholder="Finish Dashboard UI"
                    className="w-full rounded-xl border text-black  border-slate-300 px-4 py-3"
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

            <div>

                <label className="block text-sm text-black font-semibold mb-2">

                    Priority

                </label>

                <select

                    {...register("priority")}

                    className="w-full rounded-xl border text-black border-slate-300 px-4 py-3"

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

            </div>

            {/* Dates */}

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="block text-sm text-black font-semibold mb-2">

                        Start Date

                    </label>

                    <input

                        type="date"

                        {...register("startDate")}

                        className="w-full rounded-xl bg-gray-200/20 border text-black border-slate-300 px-4 py-3"

                    />

                </div>

                <div>

                    <label className="sblock text-sm text-black font-semibold mb-2">

                        Due Date

                    </label>

                    <input

                        type="date"

                        {...register("dueDate")}

                        className="w-full rounded-xl border text-black bg-gray-200/20 border-slate-300 px-4 py-3"

                    />

                </div>

            </div>

            <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition"

            >

                {loading ? "Saving..." : "Save Task"}

            </button>

        </form>

    );

}
