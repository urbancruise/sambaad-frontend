"use client";

import { useTeamLeadDashboard } from "../hooks/useTeamLeadDashboard";

import TeamOverviewCard from "../cards/TeamOverViewCard";
import TeamPerformanceCard from "../cards/TeamPerformanceCard";
import LeaderboardCard from "../cards/LeaderboardCard";
import AttentionCard from "../cards/AttentionCard";
import ActivityFeedCard from "../cards/ActivityFeedCard";
import DeadlineCard from "../cards/DeadlineCard";

const TeamLeadDashboard = ({ teamLeadId }: { teamLeadId?: string | number }) => {
  const { dashboard, loading } = useTeamLeadDashboard(teamLeadId);

  if (loading || !dashboard) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-slate-100 text-slate-600 rounded-2xl dark:bg-slate-900 dark:text-slate-400">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin dark:border-slate-700 dark:border-t-blue-500" />
        </div>
        <p className="text-sm font-semibold tracking-wide animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
  <div className="mx-auto w-full space-y-6 p-4 sm:p-6 lg:p-8 text-slate-800 dark:text-slate-100">
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        Team Dashboard
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Performance, workload and deadlines across your team
      </p>
    </div>

    <TeamOverviewCard overview={dashboard.overview} />

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-8 [&>*]:h-full">
        <TeamPerformanceCard performance={dashboard.performance} />
      </div>
      <div className="xl:col-span-4 [&>*]:h-full">
        <LeaderboardCard data={dashboard.topPerformers} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 [&>*]:h-full">
      <AttentionCard data={dashboard.needsAttention} />
      <DeadlineCard deadlines={dashboard.deadlines} />
      <div className="lg:col-span-2 xl:col-span-1 [&>*]:h-full">
        <ActivityFeedCard data={dashboard.activityFeed} />
      </div>
    </div>
  </div>
);
};

export default TeamLeadDashboard;