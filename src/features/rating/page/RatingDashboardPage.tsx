"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { ListChecks } from "lucide-react";

import { RootState } from "@/src/lib/store";
import RatingFilters from "../components/RatingFilters";
import BandSummaryCards from "../components/BandSummaryCards";
import RatingTable from "../components/RatingTable";
import FieldPoolModal from "../components/FieldPoolModal";
import { useTeamRating } from "../hooks/useTeamRating";

export default function RatingDashboardPage() {
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id) ?? 0;

    const now = new Date();
    const [departmentId, setDepartmentId] = useState("");
    const [subDepartmentId, setSubDepartmentId] = useState("");
    const [userId, setUserId] = useState("");
    const [month, setMonth] = useState(""); // "" = all months
    const [year, setYear] = useState(""); // "" = all years
    const [poolOpen, setPoolOpen] = useState(false);

    // "Manage fields" works on the chosen month, or the current month when none is chosen.
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const poolPeriod = month && year ? `${year}-${String(month).padStart(2, "0")}` : currentPeriod;

    const {
        history,
        departments,
        subDepartments,
        users,
        isTeamViewer,
        showDepartmentFilter,
        showSubDepartmentFilter,
        loading,
        error,
        clearError,
        refresh,
        updateEntry,
    } = useTeamRating({ departmentId, subDepartmentId, userId, month, year });

    // Changing the department invalidates the chosen sub-department.
    const handleDepartmentChange = (id: string) => {
        setDepartmentId(id);
        setSubDepartmentId("");
        setUserId("");
    };

    const handleSubDepartmentChange = (id: string) => {
        setSubDepartmentId(id);
        setUserId("");
    };

    const cards = history?.cards ?? [];
    const totalRated = history?.ratedCount ?? 0;

    // Heading shown when a department and/or sub-department filter is active.
    const selectedDept = departments.find((d) => String(d.id) === departmentId);
    const selectedSub = subDepartments.find((s) => String(s.id) === subDepartmentId);
    const filterHeading = [selectedDept?.department_name, selectedSub?.name].filter(Boolean).join("  ›  ");

    return (
        <div className="space-y-6 p-6">
            {/* Frozen bar: heading on the left; filters + team average on the right, one line.
                If your top navbar overlaps it, change top-0 to match the navbar height (e.g. top-16). */}
            <div className="sticky top-0 z-30 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
                    <h1 className="shrink-0 text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Performance Ratings
                    </h1>

                    <div className="flex flex-wrap items-center justify-end gap-2 lg:flex-nowrap">
                        <RatingFilters
                            departments={departments}
                            departmentId={departmentId}
                            onDepartmentChange={handleDepartmentChange}
                            subDepartments={subDepartments}
                            subDepartmentId={subDepartmentId}
                            onSubDepartmentChange={handleSubDepartmentChange}
                            showDepartment={showDepartmentFilter}
                            showSubDepartment={showSubDepartmentFilter}
                            subDepartmentDisabled={showDepartmentFilter && !departmentId}
                            showUser={isTeamViewer}
                            users={users}
                            userId={userId}
                            onUserChange={setUserId}
                            showPeriod={isTeamViewer}
                            month={month}
                            year={year}
                            onMonthChange={setMonth}
                            onYearChange={setYear}
                        />

                        {(showDepartmentFilter || showSubDepartmentFilter) && (
                            <button
                                onClick={() => setPoolOpen(true)}
                                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300"
                            >
                                <ListChecks size={16} />
                                Manage fields
                            </button>
                        )}

                        {isTeamViewer && history && (
                            <div className="flex shrink-0 items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1.5 text-white shadow-sm">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                                        Team Average
                                    </p>
                                    <p className="text-xl font-black leading-tight">{history.averagePercent}%</p>
                                </div>
                                <p className="text-[11px] leading-tight opacity-80">
                                    {totalRated}
                                    <br />
                                    rated
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                    <span>{error}</span>
                    <button onClick={clearError} className="font-semibold underline">
                        Dismiss
                    </button>
                </div>
            )}

            {isTeamViewer && history && <BandSummaryCards bandSummary={history.bandSummary} totalRated={totalRated} />}

            {filterHeading && (
                <h2 className="text-lg font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    {filterHeading}
                </h2>
            )}

            {loading && (
                <div className="rounded-xl border bg-white p-10 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                    Loading ratings...
                </div>
            )}

            {!loading && (
                <RatingTable
                    cards={cards}
                    currentUserId={currentUserId}
                    loading={false}
                    onEntryChange={updateEntry}
                    onFieldsSaved={() => refresh({ silent: true })}
                />
            )}

            <FieldPoolModal
                open={poolOpen}
                period={poolPeriod}
                onClose={() => setPoolOpen(false)}
                onSaved={() => refresh({ silent: true })}
            />
        </div>
    );
}
