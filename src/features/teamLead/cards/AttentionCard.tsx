import { TeamAttention } from "../types";

interface Props {
  data: TeamAttention[];
}

const AttentionCard = ({ data }: Props) => (
  <div className="bg-[#fff5f5] border border-rose-200/60 rounded-2xl p-5 shadow-sm h-full flex flex-col dark:bg-rose-950/20 dark:border-rose-900/40">
    <h2 className="font-extrabold text-lg text-rose-900 tracking-tight mb-4 dark:text-rose-200">
      Needs Attention
    </h2>

    {data.length === 0 ? (
      <p className="text-sm text-slate-500 dark:text-slate-400">Nothing overdue. The team is on track.</p>
    ) : (
      <div className="space-y-3">
        {data.map((e) => (
          <div key={e.employeeId} className="bg-white border border-rose-200 rounded-xl p-3.5 dark:bg-slate-900 dark:border-rose-900/50">
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{e.employeeName}</p>
            <p className="text-xs font-medium text-rose-600 mt-0.5 dark:text-rose-400">
              {e.overdueTasks} overdue task{e.overdueTasks === 1 ? "" : "s"} · {e.overdueActivities} overdue activit{e.overdueActivities === 1 ? "y" : "ies"}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AttentionCard;