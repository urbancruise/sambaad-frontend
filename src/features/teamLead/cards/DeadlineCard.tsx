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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full">
      <h2 className="font-extrabold text-lg text-slate-900 tracking-tight mb-4">
        Deadlines Overview
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Overdue */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3">
          <p className="text-xs font-extrabold text-red-600">
            Overdue ({deadlines.overdue.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1">No deadlines</p>
        </div>

        {/* Today */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-extrabold text-amber-600">
            Today ({deadlines.today.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1">No deadlines</p>
        </div>

        {/* Tomorrow */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3">
          <p className="text-xs font-extrabold text-sky-600">
            Tomorrow ({deadlines.tomorrow.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1">No deadlines</p>
        </div>

        {/* This Week */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
          <p className="text-xs font-extrabold text-emerald-600">
            This Week ({deadlines.thisWeek.length})
          </p>
          <p className="text-xs text-slate-400 italic mt-1">No deadlines</p>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCard;