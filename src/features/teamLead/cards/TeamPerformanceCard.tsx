import { TeamPerformance } from "../types";

interface Props {
  performance: TeamPerformance;
}

const SERIES = [
  { key: "performance", label: "Performance", color: "#059669" },
  { key: "completion", label: "Completion", color: "#2563eb" },
  { key: "productivity", label: "Productivity", color: "#9333ea" },
] as const;

const W = 600, H = 200, PAD = 28;

const TrendChart = ({ trend }: { trend: TeamPerformance["trend"] }) => {
  if (!trend?.length) {
    return (
      <div className="flex-1 min-h-[180px] flex items-center justify-center text-sm text-slate-400">
        No monthly performance data yet
      </div>
    );
  }
  const x = (i: number) => (trend.length === 1 ? W / 2 : PAD + (i * (W - PAD * 2)) / (trend.length - 1));
  const y = (v: number) => H - PAD - (Math.min(Math.max(v, 0), 100) / 100) * (H - PAD * 2);

  return (
    <div className="flex-1 min-h-[180px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={PAD} x2={W - PAD} y1={y(g)} y2={y(g)} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <text x={4} y={y(g) + 3} fontSize="9" fill="currentColor" className="text-slate-400">{g}</text>
          </g>
        ))}
        {SERIES.map((s) => (
          <g key={s.key}>
            <polyline
              fill="none" stroke={s.color} strokeWidth="2.5"
              points={trend.map((t, i) => `${x(i)},${y(t[s.key])}`).join(" ")}
            />
            {trend.map((t, i) => (
              <circle key={i} cx={x(i)} cy={y(t[s.key])} r="3" fill={s.color} />
            ))}
          </g>
        ))}
        {trend.map((t, i) => (
          <text key={t.month} x={x(i)} y={H - 8} fontSize="9" textAnchor="middle" fill="currentColor" className="text-slate-400">
            {t.month}
          </text>
        ))}
      </svg>
      <div className="flex gap-4 justify-center text-[11px] text-slate-500 dark:text-slate-400">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const TeamPerformanceCard = ({ performance }: Props) => {
  const stats = [
    { label: "Average Performance", value: performance.averagePerformance },
    { label: "Average Completion", value: performance.averageCompletion },
    { label: "Average Productivity", value: performance.averageProductivity },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full flex flex-col dark:bg-slate-900 dark:border-slate-800">
      <h2 className="font-extrabold text-lg text-emerald-800 tracking-tight mb-4 dark:text-emerald-400">
        Team Performance
      </h2>

      <TrendChart trend={performance.trend} />

      <div className="grid grid-cols-3 gap-3 mt-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 dark:bg-slate-800/50 dark:border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-500 mb-1 dark:text-slate-400">{s.label}</p>
            <strong className="text-2xl font-black text-slate-900 dark:text-slate-100">{s.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPerformanceCard;