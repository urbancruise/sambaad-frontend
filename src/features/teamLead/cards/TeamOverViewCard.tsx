import { TeamLeadOverview } from "../types/index";

interface Props {
  overview: TeamLeadOverview;
}

const TeamOverviewCard = ({ overview }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {/* Employees */}
      <div className="bg-[#f3e8ff] border border-purple-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-purple-950/20 dark:border-purple-900/40">
        <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center shrink-0 dark:bg-purple-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-purple-900 tracking-wide dark:text-purple-300">Employees</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.totalEmployees}</strong>
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-[#e0f2fe] border border-sky-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-sky-950/20 dark:border-sky-900/40">
        <div className="w-10 h-10 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 dark:bg-sky-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-sky-900 tracking-wide dark:text-sky-300">Active Members</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.activeEmployees}</strong>
        </div>
      </div>

      {/* Total Tasks */}
      <div className="bg-[#fef3c7] border border-amber-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-amber-950/20 dark:border-amber-900/40">
        <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 dark:bg-amber-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900 tracking-wide dark:text-amber-300">Total Tasks</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.totalTasks}</strong>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-[#dcfce7] border border-emerald-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-emerald-950/20 dark:border-emerald-900/40">
        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 dark:bg-emerald-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-900 tracking-wide dark:text-emerald-300">Completed Tasks</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.completedTasks}</strong>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-[#ffe4e6] border border-rose-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-rose-950/20 dark:border-rose-900/40">
        <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 dark:bg-rose-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-rose-900 tracking-wide dark:text-rose-300">Activities</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.totalActivities}</strong>
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-[#fee2e2] border border-red-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm dark:bg-red-950/20 dark:border-red-900/40">
        <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0 dark:bg-red-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-red-900 tracking-wide dark:text-red-300">Overdue Tasks</p>
          <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{overview.overdueActivities}</strong>
        </div>
      </div>
    </div>
  );
};

export default TeamOverviewCard;