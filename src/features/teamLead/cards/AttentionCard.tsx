import { TeamLeaderboard } from "../types";

interface Props {
  data: TeamLeaderboard[];
}

const AttentionCard = ({ data }: Props) => {
  return (
    <div className="bg-[#fff5f5] border border-rose-200/60 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
      <h2 className="font-extrabold text-lg text-rose-900 tracking-tight mb-4">
        Needs Attention
      </h2>

      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {/* Overdue Alert Item */}
        <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs">
          <p className="font-bold text-sm text-rose-600">1 Overdue Task</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Abhishek Sharma - Project Task Alpha
          </p>
        </div>

        {/* Pending Activities Item */}
        <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs">
          <p className="font-bold text-sm text-amber-700">2 Pending Activities</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Requires manager approval
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttentionCard;