"use client";

import { useMemo, useState } from "react";

import TodayWorkCard from "./cards/TodayWorkCard";
import OverviewCard from "./cards/OverviewCard";
import TodayCard from "./cards/TodayCard";
import PerformanceCard from "./cards/PerformanceCard";
import ProgressCard from "./cards/ProgressCard";
import DeadlineCard from "./cards/DeadlineCard";
import RecentActivityCard from "./cards/RecentActivityCard";
import TimelineCard from "./cards/TimelineCard";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardFilters from "./DashboardFilters";
import MonthCalendar from "@/src/features/calendar/components/MonthlyCalendar";
// import EmployeeQuickActions from "./EmployeeQuickActions";
import { useEmployeeDashboardData } from "../hooks/useEmployeeDashboardData";


export default function EmployeeDashboard() {
    const [filter, setFilter] = useState("ALL");
    const {
        dashboard,
        loading,
        updatingActivityId,
        completeTodayActivity,
        refreshDashboard,
    } = useEmployeeDashboardData();

    const todayWork = useMemo(() => {
        if (!dashboard?.todayWork) return [];

        if (filter === "ALL") {
            return dashboard.todayWork;
        }

        return dashboard.todayWork.filter(
            (goal) => goal.status === filter
        );
    }, [dashboard?.todayWork, filter]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!dashboard) {
        return (
            <div className="py-20 text-center text-slate-500">
                Dashboard not available.
            </div>
        );
    }
    return (

        <div className="space-y-8 px-4 py-6 lg:px-1">
            <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                        Employee Command Center
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Today&apos;s execution board
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        Performance metrics and activity overview
                    </p>
                </div>
{/* 
                <EmployeeQuickActions
                    onChanged={refreshDashboard}
                /> */}
            </div>

            <OverviewCard
                overview={dashboard.overview}
            />

            <TodayCard
                today={dashboard.today}
            />

            <DashboardFilters
                value={filter}
                onChange={setFilter}
            />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
                <TodayWorkCard
                    work={todayWork}
                    onComplete={completeTodayActivity}
                    updatingActivityId={updatingActivityId}
                />

                <div className="rounded-2xl  border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold">
                            Calendar
                        </h2>
                        <p className="text-sm text-slate-500">
                            Live schedule from calendar APIs
                        </p>
                    </div>
                    <MonthCalendar />
                </div>
            </div>

            <PerformanceCard
                performance={dashboard.performance}
            />

            <ProgressCard
                analytics={dashboard.analytics}
            />

            <DeadlineCard
                deadlines={dashboard.deadlines}
            />

            <RecentActivityCard
                activities={dashboard.recentActivities}
            />

            <TimelineCard
                timeline={dashboard.timeline}
            />

        </div>

    );

}
