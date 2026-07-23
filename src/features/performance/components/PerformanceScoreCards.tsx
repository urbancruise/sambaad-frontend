"use client";

import {
  Target,
  CheckSquare,
  ListChecks,
  Clock3,
  Zap,
  Trophy,
} from "lucide-react";

interface Props {
  scores: {
    goalScore: number;
    taskScore: number;
    activityScore: number;
    onTimeScore: number;
    productivityScore: number;
    performanceScore: number;
  };
}

const cards = [
  {
    key: "performanceScore",
    title: "Performance",
    icon: Trophy,
    color: "bg-amber-500",
  },
  {
    key: "goalScore",
    title: "Goals",
    icon: Target,
    color: "bg-blue-500",
  },
  {
    key: "taskScore",
    title: "Tasks",
    icon: CheckSquare,
    color: "bg-green-500",
  },
  {
    key: "activityScore",
    title: "Activities",
    icon: ListChecks,
    color: "bg-purple-500",
  },
  {
    key: "onTimeScore",
    title: "On Time",
    icon: Clock3,
    color: "bg-cyan-500",
  },
  {
    key: "productivityScore",
    title: "Productivity",
    icon: Zap,
    color: "bg-rose-500",
  },
];

export default function PerformanceScoreCards({
  scores,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const value =
          scores[card.key as keyof typeof scores];

        return (
          <div
            key={card.key}
            className="rounded-2xl bg-white border shadow-sm p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {value.toFixed(2)}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Score
                </p>
              </div>

              <div
                className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}