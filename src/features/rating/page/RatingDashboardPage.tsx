"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/src/lib/store";
import RatingFilters from "../components/RatingFilters";
import BandSummaryCards from "../components/BandSummaryCards";
import RatingTable from "../components/RatingTable";
import { useTeamRating } from "../hooks/useTeamRating";
import { EmployeeRating } from "../types";

export default function RatingDashboardPage() {
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id) ?? 0;

    const now = new Date();
    const [departmentId, setDepartmentId] = useState("");
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const { team, departments, loading, updateField } = useTeamRating(departmentId, month, year);

    const totalRated = team?.bandSummary.reduce((sum, b) => sum + b.count, 0) ?? 0;

    const groups = useMemo(() => {
        if (!team) return [];

        const byDept = new Map<string, { departmentName: string; employees: EmployeeRating[] }>();

        for (const emp of team.employees) {
            const key = emp.departmentName ?? "Unassigned";
            if (!byDept.has(key)) {
                byDept.set(key, { departmentName: key, employees: [] });
            }
            byDept.get(key)!.employees.push(emp);
        }

        return Array.from(byDept.values());
    }, [team]);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Performance Ratings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Rate your team, track self vs. senior scores, and see how everyone's trending this period.
                </p>
            </div>

            {/* Row container for Filters and Team Average Card */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="w-full lg:w-auto">
                    <RatingFilters
                        departments={departments}
                        departmentId={departmentId}
                        onDepartmentChange={setDepartmentId}
                        month={month}
                        year={year}
                        onMonthChange={setMonth}
                        onYearChange={setYear}
                    />
                </div>

                {team && (
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-2 text-white flex items-center justify-between lg:w-[300px] shrink-0 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Team Average</p>
                            <p className="text-3xl font-black mt-0.5">{team.teamAverage} <span className="text-base font-medium opacity-70">/ 15</span></p>
                        </div>
                        <p className="text-xs opacity-80">{totalRated} rated this period</p>
                    </div>
                )}
            </div>

            {team && (
                <BandSummaryCards bandSummary={team.bandSummary} totalRated={totalRated} />
            )}

            {loading && (
                <div className="rounded-xl border bg-white p-10 text-center text-slate-400">Loading ratings...</div>
            )}

            {!loading && groups.length === 0 && (
                <div className="rounded-xl border border-dashed bg-white p-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-700">No ratings to show</h3>
                </div>
            )}

            {!loading && groups.map((group) => (
                <div key={group.departmentName} className="space-y-2">
                    {groups.length > 1 && (
                        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            {group.departmentName}
                        </h2>
                    )}
                    <RatingTable
                        employees={group.employees}
                        teamAverage={team?.teamAverage ?? 0}
                        currentUserId={currentUserId}
                        loading={false}
                        onFieldChange={updateField}
                    />
                </div>
            ))}
        </div>
    );
}