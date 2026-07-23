"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    goalSchema,
    GoalFormValues,
} from "../schema/goal.schema";

interface GoalFormProps {
    defaultValues?: Partial<GoalFormValues>;
    loading?: boolean;
    onSubmit: (
        values: GoalFormValues
    ) => Promise<void>;
}

export default function GoalForm({
    defaultValues,
    loading = false,
    onSubmit,
}: GoalFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues,
    });

    const isEdit = !!defaultValues;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100"
        >
            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Goal Title
                    <span className="text-red-500 ml-1">*</span>
                </label>

                <input
                    {...register("title")}
                    placeholder="Complete Backend Project"
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 bg-slate-50/50 outline-none transition placeholder:text-slate-400 ${
                        errors.title
                            ? "border-red-500 focus:border-red-500"
                            : "border-slate-200 focus:border-emerald-500 focus:bg-white focus:shadow-sm"
                    }`}
                />

                {errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                </label>

                <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:shadow-sm transition resize-none placeholder:text-slate-400"
                    placeholder="Write goal description..."
                />
            </div>

            {/* Goal Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Goal Type */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Goal Type
                    </label>

                    <select
                        {...register("goalType")}
                        className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition ${
                            errors.goalType ? "border-red-500" : "border-slate-200"
                        }`}
                    >
                        <option value="">Select Goal Type</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="LONG_TERM">Long Term</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    {errors.goalType && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                            {errors.goalType.message}
                        </p>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Priority
                    </label>

                    <select
                        {...register("priority")}
                        className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition ${
                            errors.priority ? "border-red-500" : "border-slate-200"
                        }`}
                    >
                        <option value="">Select Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>

                    {errors.priority && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                            {errors.priority.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Date
                    </label>

                    <input
                        type="date"
                        {...register("startDate")}
                        className="w-full rounded-xl border bg-slate-50/50 border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Due Date
                    </label>

                    <input
                        type="date"
                        {...register("dueDate")}
                        className="w-full rounded-xl border bg-slate-50/50 border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 font-semibold transition shadow-sm hover:shadow active:scale-[0.99]"
            >
                {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Goal"
                    : "Create Goal"}
            </button>
        </form>
    );
}