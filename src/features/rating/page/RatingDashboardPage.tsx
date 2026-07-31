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

    // Group by department so each table renders with THAT department's
    // own field labels — a mixed, ungrouped list was previously always
    // rendered using only the first employee's fields, which showed
    // e.g. "Sales Improvement Ideas" for every department regardless
    // of whether it actually applied to them.
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

            <RatingFilters
                departments={departments}
                departmentId={departmentId}
                onDepartmentChange={setDepartmentId}
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
            />

            {team && (
                <>
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Team Average</p>
                            <p className="text-4xl font-black mt-1">{team.teamAverage} <span className="text-lg font-medium opacity-70">/ 15</span></p>
                        </div>
                        <p className="text-sm opacity-80">{totalRated} rated this period</p>
                    </div>

                    <BandSummaryCards bandSummary={team.bandSummary} totalRated={totalRated} />
                </>
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