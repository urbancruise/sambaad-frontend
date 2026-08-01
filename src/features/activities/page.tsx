"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { useActivities } from "./hooks/useActivities";
import { useTasks } from "../tasks/hooks/useTask";
import { setLoading as setTasksLoading, setTasks } from "../tasks/store/taskSlice";
import { getTasks } from "../tasks/api/task.service";
import {
    fetchActivitiesStart,
    fetchActivitiesSuccess,
    fetchActivitiesFailure,
} from "./store/activitySlice";
import TaskActivityList from './components/TaskActivityList';
import { getActivities } from "./api/activity.service";
import CreateActivityModal from "./components/CreateActivityModal";

export default function ActivityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks } = useTasks();
    const { activities, loading, error } = useActivities();
    const [open, setOpen] = useState(false);

    // Managers view/manage their own assigned work but cannot self-assign
    // new goals/tasks/activities — only assign to their subordinate TLs.
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);
    const canCreate = !["MANAGER", "HOD"].includes(currentRole ?? "");

    useEffect(() => {
        loadActivities();
        loadTasks();
    }, [dispatch]);

    const loadActivities = async () => {
        try {
            dispatch(fetchActivitiesStart());
            const data = await getActivities();
            dispatch(fetchActivitiesSuccess(data));
        } catch {
            dispatch(fetchActivitiesFailure("Unable to load activities."));
        }
    };

    // This page groups activities BY task (see TaskActivityList below), so
    // it needs tasks loaded too — previously this only happened on the
    // Tasks page itself, meaning landing here directly (without visiting
    // Tasks first) showed nothing even though activities had loaded fine.
    const loadTasks = async () => {
        try {
            dispatch(setTasksLoading(true));
            const data = await getTasks();
            dispatch(setTasks(data));
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setTasksLoading(false));
        }
    };

    return (
        <div className="space-y-6 p-4 w-full min-h-screen">
            {/* Control Panel Header Matrix */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        System Activities
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        Manage and track real-time operation parameters
                    </p>
                </div>

                {canCreate && (
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold tracking-wide text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/10 active:scale-98 transition-all"
                    >
                        + Create Activity
                    </button>
                )}
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="text-center py-20 text-base font-mono text-emerald-500 dark:text-emerald-400 animate-pulse">
                    Executing data synchronization trace...
                </div>
            )}

            {/* Empty Framework State Handler */}
            {!loading && activities.length === 0 && (
                <div className="bg-white dark:bg-[#0c1224]/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-16 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                        No Active Nodes Found
                    </h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                        Initialize your first system activity node to populate data streams.
                    </p>
                </div>
            )}

            {/* Main Interactive Layout Engine */}
            {!loading && activities.length > 0 && (
                <TaskActivityList tasks={tasks} activities={activities} />
            )}
            {error && (

              <div className="
               rounded-xl
            bg-red-50
            p-5
            text-red-600
             ">

            {error}

            </div>
        )}

            {canCreate && (
                <CreateActivityModal open={open} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}