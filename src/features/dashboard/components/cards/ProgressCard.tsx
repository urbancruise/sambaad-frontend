"use client";

import {
  Target,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

interface ProgressCardProps {
  analytics: {
    goalProgress: number;
    taskProgress: number;
    activityProgress: number;
  };
}

interface CircleProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function ProgressCircle({
  title,
  value,
  color,
  icon,
}: CircleProps) {

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (Math.min(value, 100) / 100) * circumference;

  return (

    <div className="flex flex-col items-center">

      <div className="relative">

        <svg
          width="110"
          height="110"
          className="-rotate-90"
        >

          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />

          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset .8s ease",
            }}
          />

        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          {icon}

          <span className="text-xl font-bold mt-1">
            {value}%
          </span>

        </div>

      </div>

      <p className="mt-3 font-semibold text-slate-700">
        {title}
      </p>

    </div>

  );

}

export default function ProgressCard({
  analytics,
}: ProgressCardProps) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-8">

        <h2 className="text-xl font-bold">
          Progress Analytics
        </h2>

        <p className="text-sm text-slate-500">
          Live completion status
        </p>

      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

        <ProgressCircle
          title="Goals"
          value={analytics.goalProgress}
          color="#3b82f6"
          icon={<Target className="text-blue-600" size={18} />}
        />

        <ProgressCircle
          title="Tasks"
          value={analytics.taskProgress}
          color="#10b981"
          icon={<ClipboardCheck className="text-emerald-600" size={18} />}
        />

        <ProgressCircle
          title="Activities"
          value={analytics.activityProgress}
          color="#8b5cf6"
          icon={<CheckCircle2 className="text-violet-600" size={18} />}
        />

      </div>

    </div>

  );

}