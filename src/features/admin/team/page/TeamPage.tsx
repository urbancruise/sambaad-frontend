"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import UserTable from "../components/UserTable";
import { useAdminTeam } from "../hooks/UseadminTeam";
import { UserRole } from "../types";

const ROLE_FILTERS: { label: string; value: UserRole | "ALL" }[] = [
    { label: "All Roles", value: "ALL" },
    { label: "HOD", value: "HOD" },
    { label: "Manager", value: "MANAGER" },
    { label: "TeamLead", value: "TEAM_LEAD" },
    { label: "Employee", value: "EMPLOYEE" },
];

export default function AdminTeamPage() {
    const { users, loading } = useAdminTeam();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase());
            const matchesRole =
                roleFilter === "ALL" ||
                u.role === roleFilter ||
                (roleFilter === "HOD" && u.role === "ZONAL_HEAD");
            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Organization</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View and manage every user across the organization.
                </p>
            </div>

            {/* Toolbar layout matching the image reference */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm focus:border-slate-400 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {ROLE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setRoleFilter(f.value)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                                roleFilter === f.value
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <UserTable users={filtered} loading={loading} />
        </div>
    );
}