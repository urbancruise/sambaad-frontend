import type { VisualState } from "./calendar.utils";

export const PRIORITY: Record<string, { label: string; swatch: string; pending: string; active: string }> = {
    LOW: {
        label: "Low", swatch: "bg-sky-500",
        pending: "bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
        active: "bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-50",
    },
    MEDIUM: {
        label: "Medium", swatch: "bg-indigo-500",
        pending: "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100",
        active: "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-50",
    },
    HIGH: {
        label: "High", swatch: "bg-amber-500",
        pending: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
        active: "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-50",
    },
    CRITICAL: {
        label: "Critical", swatch: "bg-fuchsia-500",
        pending: "bg-fuchsia-50 text-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-100",
        active: "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-900/50 dark:text-fuchsia-50",
    },
};

export const STATE: Record<VisualState, { label: string; dot: string; chip: string }> = {
    PENDING: {
        label: "Pending",
        dot: "border-[1.5px] border-slate-400 dark:border-slate-500",
        chip: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    IN_PROGRESS: {
        label: "In progress",
        dot: "bg-blue-500",
        chip: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    },
    COMPLETED: {
        label: "Completed",
        dot: "bg-emerald-500",
        chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    OVERDUE: {
        label: "Overdue",
        dot: "bg-red-500 ring-2 ring-red-200 dark:ring-red-900",
        chip: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    },
    CANCELLED: {
        label: "Cancelled",
        dot: "bg-slate-300 dark:bg-slate-600",
        chip: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    },
};

export const TYPE_LABEL: Record<string, string> = {
    GOAL: "Goal",
    TASK: "Task",
    ACTIVITY: "Activity",
};