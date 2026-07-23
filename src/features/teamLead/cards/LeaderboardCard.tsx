import { TeamLeaderboard } from "../types";

interface Props {
  data: TeamLeaderboard[];
}

const LeaderboardCard = ({ data }: Props) => {
  return (
    <div className="bg-[#fffbeb] border border-amber-200/80 rounded-2xl p-5 shadow-sm">
      <h2 className="font-extrabold text-lg text-amber-900 tracking-tight mb-4">
        Top Performers
      </h2>

      <div className="space-y-3">
        {data.map((employee, index) => (
          <div
            key={employee.employeeId}
            className="bg-white border border-amber-200/60 rounded-xl p-3 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {/* Rank Badge */}
              <div className="w-6 h-6 rounded bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>

              {/* Name */}
              <p className="font-bold text-sm text-slate-800 truncate w-28 sm:w-36">
                {employee.employeeName}
              </p>

              {/* Teal Progress Bar */}
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden max-w-xs mx-2">
                <div
                  className="bg-[#0d9488] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(employee.performanceScore, 100)}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <span className="text-sm font-extrabold text-slate-900 ml-2">
              {employee.performanceScore}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;