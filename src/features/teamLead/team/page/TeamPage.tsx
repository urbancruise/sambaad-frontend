"use client";

import { useMemo, useState } from "react";
import { useTeam } from "../hooks/useTeam";
import TeamFilters from "../components/TeamFilters";
import TeamTable from "../components/TeamTable";

export default function TeamPage() {
  const { members, loading } = useTeam();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filteredMembers = useMemo(() => {
    let data = [...members];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      data = data.filter(
        (member) =>
          member.fullName.toLowerCase().includes(keyword) ||
          member.email.toLowerCase().includes(keyword) ||
          member.username.toLowerCase().includes(keyword)
      );
    }

    if (status === "ACTIVE") {
      data = data.filter((member) => member.isActive);
    }

    if (status === "INACTIVE") {
      data = data.filter((member) => !member.isActive);
    }

    return data;
  }, [members, search, status]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#0F172A] p-6 text-white shadow-md flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold tracking-wider text-teal-400 uppercase">
            Team Management
          </p>
          <h1 className="mt-1 text-2xl font-bold">My Team</h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor workload, performance and employee progress.
          </p>
        </div>
      </div>

      {/* Filters */}
      <TeamFilters
        search={search}
        status={status}
        onSearch={setSearch}
        onStatusChange={setStatus}
      />

      {/* Team Cards Grid */}
      <TeamTable members={filteredMembers} loading={loading} />
    </div>
  );
}