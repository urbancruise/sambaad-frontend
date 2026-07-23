import Link from "next/link";
import { TeamMember } from "../types";

interface Props {
  member: TeamMember;
}

export default function TeamCard({ member }: Props) {
  // Extract initials for avatar
  const initials = member.fullName
    ? member.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 3)
    : "NA";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        {/* Top Header: Avatar, Name & Status */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-800">
              {initials}
            </div>
            <h3 className="font-semibold text-slate-900">{member.fullName}</h3>
          </div>

          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              member.isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                member.isActive ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {member.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs">
          {/* Column 1: Goals */}
          <div className="space-y-3">
            <div>
              <p className="text-slate-500">Goals</p>
              <p className="font-semibold text-slate-800">
                {member.completedGoals} / {member.totalGoals}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Activities</p>
              <p className="font-semibold text-slate-800">
                {member.completedActivities} / {member.totalActivities}
              </p>
            </div>
          </div>

          {/* Column 2: Tasks + Icons */}
          <div className="space-y-3">
            <div className="flex items-start gap-1.5">
              <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <div>
                <p className="text-slate-500">Tasks</p>
                <p className="font-semibold text-slate-800">
                  {member.completedTasks} / {member.totalTasks}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-slate-500">Performance</p>
                <p className="font-semibold text-teal-600">
                  {member.performanceScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Performance Circular Gauge */}
          <div className="flex flex-col items-center justify-center">
            <svg className="h-4 w-4 text-amber-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 text-xs font-bold text-slate-800">
              {member.performanceScore.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Status Banners (Pending / Overdue) */}
        <div className="mt-4 flex overflow-hidden rounded-lg text-xs font-medium">
          <div className="flex-1 bg-amber-400/80 px-3 py-2 text-slate-900">
            <p className="text-[10px] opacity-80">Pending</p>
            <p className="font-bold">{member.pendingActivities}</p>
          </div>
          <div className="flex-1 bg-red-300 px-3 py-2 text-slate-900">
            <p className="text-[10px] opacity-80">Overdue</p>
            <p className="font-bold">{member.overdueActivities}</p>
          </div>
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="mt-4 flex justify-end">
        <Link
          href={`/teamlead/team/${member.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          View Profile
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}