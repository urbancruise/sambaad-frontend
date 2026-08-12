"use client";

import { useTeamLeadDashboard } from "../hooks/useTeamLeadDashboard";

import TeamOverviewCard from "../cards/TeamOverViewCard";
import TeamPerformanceCard from "../cards/TeamPerformanceCard";
import LeaderboardCard from "../cards/LeaderboardCard";
import AttentionCard from "../cards/AttentionCard";
import ActivityFeedCard from "../cards/ActivityFeedCard";
import DeadlineCard from "../cards/DeadlineCard";

const TeamLeadDashboard = () => {
  const { dashboard, loading } = useTeamLeadDashboard();

  if (loading || !dashboard) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-slate-100 text-slate-600 rounded-2xl">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wide animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Team Dashboard
        </h1>
      </div>

      {/* Main Grid Layout matching design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview Cards */}
          <TeamOverviewCard overview={dashboard.overview} />

          {/* Workload / Work Table Placeholder or Workload Card */}
          {/* Note: Insert WorkloadCard here if needed */}

          {/* Bottom Left Grid: Attention & Deadlines side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttentionCard />
            <DeadlineCard deadlines={dashboard.deadlines} />
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <TeamPerformanceCard performance={dashboard.performance} />
          <LeaderboardCard data={dashboard.topPerformers} />
          <ActivityFeedCard data={dashboard.activityFeed} />
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
