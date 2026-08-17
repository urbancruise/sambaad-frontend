import { DeadlineItem } from "../types";

interface Props {
  deadlines: {
    overdue: DeadlineItem[];
    today: DeadlineItem[];
    tomorrow: DeadlineItem[];
    thisWeek: DeadlineItem[];
  };
}

const DeadlineCard = ({ deadlines }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-extrabold text-lg text-slate-900 tracking-tight mb-4 dark:text-slate-100">
        Deadlines Overview
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Overdue */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 dark:bg-red-950/20 dark:border-red-900/40">
          <p className="text-xs font-extrabold text-red-600 dark:text-red-400">
            Overdue ({deadlines.overdue.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1 dark:text-slate-500">No deadlines</p>
        </div>

        {/* Today */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 dark:bg-amber-950/20 dark:border-amber-900/40">
          <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
            Today ({deadlines.today.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1 dark:text-slate-500">No deadlines</p>
        </div>

        {/* Tomorrow */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3 dark:bg-sky-950/20 dark:border-sky-900/40">
          <p className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
            Tomorrow ({deadlines.tomorrow.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1 dark:text-slate-500">No deadlines</p>
        </div>

        {/* This Week */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 dark:bg-emerald-950/20 dark:border-emerald-900/40">
          <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            This Week ({deadlines.thisWeek.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1 dark:text-slate-500">No deadlines</p>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCard;