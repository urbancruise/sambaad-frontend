"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { useTasks } from "./hooks/useTask";
import { setLoading, setTasks } from "./store/taskSlice";
import { getTasks } from "./api/task.service";
import { useGoals } from "@/src/features/goals/hooks/useGoals";
import { getGoals } from "@/src/features/goals/api/goal.service";
import {
    fetchGoalsStart,
    fetchGoalsSuccess,
    fetchGoalsFailure,
} from "@/src/features/goals/store/goalSlice";
import TaskList from "./components/TaskList";
import CreateTaskModal from "./components/CreateTaskModal";
import { Plus, Layers } from "lucide-react";

export default function TaskPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading } = useTasks();
    const [open, setOpen] = useState(false);
    const { goals } = useGoals();

    // Managers view/manage their own assigned work but cannot self-assign
    // new goals/tasks/activities — only assign to their subordinate TLs.
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);
    const canCreate = !["MANAGER", "HOD"].includes(currentRole ?? "");

    useEffect(() => {
        const loadTasks = async () => {
            try {
                dispatch(setLoading(true));
                const data = await getTasks();
                dispatch(setTasks(data));
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        // This page groups tasks BY goal (see TaskList/TaskGroup below),
        // so it needs goals loaded too — previously this only happened
        // on the Goals page itself, meaning landing here directly
        // (without visiting Goals first) showed nothing even though
        // tasks had loaded fine.
        const loadGoals = async () => {
            dispatch(fetchGoalsStart());
            try {
                const response = await getGoals();
                dispatch(
                    fetchGoalsSuccess({
                        goals: response.goals,
                        pagination: response.pagination,
                    })
                );
            } catch (error: any) {
                dispatch(fetchGoalsFailure(error.message));
            }
        };

        loadTasks();
        loadGoals();
    }, [dispatch]);

    return (
        <div className="space-y-8 p-6 sm:p-8 bg-[#f3f4f6] text-slate-800 min-h-screen selection:bg-[#3bc4d9]/20 dark:bg-slate-950 dark:text-slate-100">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                        Tasks
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium tracking-wide dark:text-slate-400">
                        Monitor and manage operational subunits across all active objectives.
                    </p>
                </div>

                {canCreate && (
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-sm transition-all duration-200 active:scale-95 text-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        <Plus size={18} />
                        <span>Create Interface Task</span>
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin dark:border-slate-800 dark:border-t-slate-100" />
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        Loading Task Mainframe...
                    </span>
                </div>
            )}

            {/* Empty State */}
            {!loading && tasks.length === 0 && (
                <div className="bg-white border border-slate-100/80 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-900/40 dark:border-slate-800 dark:shadow-none">
                    <div className="mx-auto w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 text-slate-400 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-300">
                        <Layers size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        No Active Nodes Found
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm max-w-sm mx-auto leading-relaxed dark:text-slate-400">
                        Your workspace is clean. Initialize your sector by configuring a new task.
                    </p>
                </div>
            )}

            {/* Grid Area */}
            {!loading && tasks.length > 0 && (
                <div className="animate-in fade-in duration-300">
                    <TaskList goals={goals} tasks={tasks} />
                </div>
            )}

            {canCreate && (
                <CreateTaskModal open={open} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}