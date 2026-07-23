"use client";

import TeamCard from "./TeamCard";
import { TeamMember } from "../types";

interface Props {
  members: TeamMember[];
  loading: boolean;
}

export default function TeamTable({ members, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-slate-500 shadow-sm">
        Loading team...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
        No employees found.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );
}