"use client";

import TeamLeadCard from "./hodCard";
import { TeamLeadSummary } from "../type";

interface Props {
    teamLeads: TeamLeadSummary[];
    loading: boolean;
}

export default function TeamLeadTable({ teamLeads, loading }: Props) {
    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                Loading team leads...
            </div>
        );
    }

    if (!teamLeads.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-700">No Team Leads Found</h3>
                <p className="mt-2 text-sm text-slate-500">
                    No team leads currently report to you.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {teamLeads.map((tl) => (
                <TeamLeadCard key={tl.id} teamLead={tl} />
            ))}
        </div>
    );
}
