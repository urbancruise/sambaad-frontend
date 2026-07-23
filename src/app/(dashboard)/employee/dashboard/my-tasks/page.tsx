"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserCheck } from "lucide-react";

import type { AppDispatch } from "@/src/lib/store";

import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";

import {
    fetchDashboardStart,
    fetchDashboardSuccess,
    fetchDashboardFailure,
} from "@/src/features/dashboard/store/dashboardSlice";

import { getEmployeeDashboard } from "@/src/features/dashboard/api/dashboard.service";

import TaskCard from "@/src/features/tasks/components/TaskCard";

export default function EmployeeTasksCheckingPage() {
  
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useAuth();
  
  const {
    dashboard,
    loading,
    error,
  } = useDashboard();
  console.log(dashboard,"hello hii")
  
    useEffect(() => {

        const loadDashboard = async () => {

            dispatch(fetchDashboardStart());

            try {

                const data =
                    await getEmployeeDashboard();

                dispatch(
                    fetchDashboardSuccess(data)
                );

            } catch {

                dispatch(
                    fetchDashboardFailure(
                        "Failed to load dashboard"
                    )
                );

            }

        };

        loadDashboard();

    }, [dispatch]);

    if (!user) return null;

    if (user.role !== "EMPLOYEE") {

        return (

            <div className="flex h-screen items-center justify-center text-red-600 text-xl font-bold">

                Access Denied

            </div>

        );

    }

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center">

                Loading...

            </div>

        );

    }

    if (error) {

        return (

            <div className="flex h-screen items-center justify-center text-red-600">

                {error}

            </div>

        );

    }

    console.log("Dashboard =>", dashboard);

    /**
     * Change ONLY this line if your dashboard shape is different.
     */

    const tasks =
        dashboard?.task?.tasks ||
        dashboard?.task ||
        [];

    return (

        <div className="mx-auto max-w-6xl p-6 space-y-6">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h1 className="flex items-center gap-2 text-2xl font-bold">

                    <UserCheck className="text-emerald-600" />

                    My Tasks

                </h1>

                <p className="text-slate-500 mt-2">

                    View and manage your assigned tasks.

                </p>

            </div>

            {tasks.length === 0 ? (

                <div className="rounded-xl border bg-white p-10 text-center text-slate-500">

                    No Tasks Assigned

                </div>

            ) : (

                <div className="grid gap-6">

                    {tasks.map((task: any) => (

                        <TaskCard
                            key={task.id}
                            task={task}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}