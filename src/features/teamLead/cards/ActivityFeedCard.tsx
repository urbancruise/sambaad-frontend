import { ActivityFeed } from "../types";

interface Props {
  data: ActivityFeed[];
}

const ActivityFeedCard = ({ data }: Props) => {
  // Helper for status badge styling
  const getBadgeStyle = (status: string = "") => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-[#10b981] text-white";
      case "PENDING":
        return "bg-[#3b82f6] text-white";
      case "UPDATED":
        return "bg-[#a855f7] text-white";
      case "REVIEW":
        return "bg-[#f59e0b] text-white";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h2 className="font-extrabold text-lg text-slate-900 tracking-tight mb-4">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {data.map((activity) => (
          <div
            key={activity.id}
            className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              {/* Avatar Box */}
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center shrink-0">
                {activity.employee.charAt(0)}
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 truncate">
                  {activity.employee}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {activity.activity}: {activity.task}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  10 mins ago
                </p>
              </div>
            </div>

            {/* Status Pill */}
            <span
              className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase shrink-0 ${getBadgeStyle(
                activity.status
              )}`}
            >
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeedCard;