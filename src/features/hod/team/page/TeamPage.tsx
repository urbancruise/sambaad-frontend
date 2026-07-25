"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import TeamLeadTable from "../components/hodTable";
import { usehodTeam } from "../hooks/useHodTeam";

export default function hodTeamPage() {
    const { teamLeads, loading } = usehodTeam();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return teamLeads.filter((tl) =>
            tl.fullName.toLowerCase().includes(search.toLowerCase())
        );
    }, [teamLeads, search]);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Team Leads</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View and manage the team leads who report to you.
                </p>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search team leads..."
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
            </div>

            <TeamLeadTable teamLeads={filtered} loading={loading} />
        </div>
    );
}
