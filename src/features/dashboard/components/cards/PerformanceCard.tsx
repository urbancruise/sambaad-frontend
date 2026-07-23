"use client";

import {
  Activity,
  Gauge,
  TrendingUp,
  TimerReset,
} from "lucide-react";

interface PerformanceCardProps {
  performance: {
    completionRate: number;
    productivityScore: number;
    efficiencyScore: number;
    delayRate: number;
    performanceScore: number;
  };
}

function ProgressItem({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div className={`rounded-lg p-2 ${color}`}>
            {icon}
          </div>

          <span className="font-medium text-slate-700">
            {title}
          </span>

        </div>

        <span className="font-bold">
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />

      </div>

    </div>
  );
}

export default function PerformanceCard({
  performance,
}: PerformanceCardProps) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Performance
          </h2>

          <p className="text-sm text-slate-500">
            Live performance metrics
          </p>

        </div>

        <div className="rounded-xl bg-slate-900 px-5 py-3 text-center text-white">

          <p className="text-xs uppercase tracking-widest text-slate-300">
            Overall Score
          </p>

          <h1 className="text-3xl font-bold">
            {performance.performanceScore}
          </h1>

        </div>

      </div>

      <div className="space-y-5">

        <ProgressItem
          title="Completion Rate"
          value={performance.completionRate}
          icon={<TrendingUp size={18} />}
          color="bg-blue-100 text-blue-600"
        />

        <ProgressItem
          title="Productivity"
          value={performance.productivityScore}
          icon={<Activity size={18} />}
          color="bg-emerald-100 text-emerald-600"
        />

        <ProgressItem
          title="Efficiency"
          value={performance.efficiencyScore}
          icon={<Gauge size={18} />}
          color="bg-violet-100 text-violet-600"
        />

        <ProgressItem
          title="Delay Rate"
          value={performance.delayRate}
          icon={<TimerReset size={18} />}
          color="bg-red-100 text-red-600"
        />

      </div>

    </div>

  );

}