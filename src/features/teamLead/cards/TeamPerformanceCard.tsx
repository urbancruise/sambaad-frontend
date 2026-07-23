import { TeamPerformance } from "../types";

interface Props {
  performance: TeamPerformance;
}

const TeamPerformanceCard = ({ performance }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
      <h2 className="font-extrabold text-lg text-emerald-800 tracking-tight mb-4">
        Team Performance
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {/* Average Performance */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            Average Performance
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-2xl font-black text-slate-900">
              {performance.averagePerformance}%
            </strong>
            <svg className="w-10 h-5 text-emerald-600" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M0 15 Q 12 5, 25 10 T 50 2" />
            </svg>
          </div>
        </div>

        {/* Average Completion */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            Average Completion
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-2xl font-black text-slate-900">
              {performance.averageCompletion}%
            </strong>
            <svg className="w-10 h-5 text-blue-600" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M0 18 Q 15 12, 30 5 T 50 2" />
            </svg>
          </div>
        </div>

        {/* Average Productivity */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            Average Productivity
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <strong className="text-2xl font-black text-slate-900">
              {performance.averageProductivity}%
            </strong>
            <svg className="w-10 h-5 text-purple-600" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M0 10 Q 15 18, 30 8 T 50 3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformanceCard;