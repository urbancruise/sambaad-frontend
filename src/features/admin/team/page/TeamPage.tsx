"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import UserTable from "../components/UserTable";
import Pagination from "@/src/components/common/Pagination";
import { useAdminTeam } from "../hooks/UseadminTeam";
import { UserRole } from "../types";

const LIMIT = 12;

const ROLE_FILTERS: { label: string; value: UserRole | "ALL" }[] = [
    { label: "All Roles", value: "ALL" },
    { label: "HOD", value: "HOD" },
    { label: "Manager", value: "MANAGER" },
    { label: "TeamLead", value: "TEAM_LEAD" },
    { label: "Employee", value: "EMPLOYEE" },
];

export default function AdminTeamPage() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
    const [departmentId, setDepartmentId] = useState<number | undefined>();
    const [page, setPage] = useState(1);

    // debounce: hit the API 350ms after the person stops typing
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 350);
        return () => clearTimeout(t);
    }, [searchInput]);

    const { users, total, totalPages, departments, loading } = useAdminTeam({
        page,
        limit: LIMIT,
        search,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        departmentId,
    });

    // if the last item on the last page disappears, step back
    useEffect(() => {
        if (!loading && page > totalPages) setPage(totalPages);
    }, [loading, page, totalPages]);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Organization</h1>
                <p className="mt-1 text-sm text-slate-500">View and manage every user across the organization.</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative w-full md:max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search name, username, email or employee ID..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>

                    <select
                        value={departmentId ?? ""}
                        onChange={(e) => {
                            setDepartmentId(e.target.value ? Number(e.target.value) : undefined);
                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {ROLE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => { setRoleFilter(f.value); setPage(1); }}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                                roleFilter === f.value
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* keep old cards visible while the next page loads, so the grid doesn't flash */}
            <div className={loading && users.length > 0 ? "opacity-60 transition-opacity" : ""}>
                <UserTable users={users} loading={loading && users.length === 0} />
            </div>

            <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onChange={setPage} />
        </div>
    );
}