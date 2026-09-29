"use client";

import GoalCard from "./goalCard";
import { EmployeeGoal } from "../types";

interface Props {
  goals: EmployeeGoal[];
  loading: boolean;
  onChanged?: () => void;
}

export default function GoalTable({ goals, loading, onChanged }: Props) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500 shadow-xs">
        Loading goals...
      </div>
    );
  }

  if (!goals.length) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
        <h3 className="text-base font-semibold text-slate-700">
          No Goals Found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          This employee doesn't have any assigned goals.
        </p>
      </div>
    );
  }

  return (
    /* Full width grid container spanning across the whole dashboard area */
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onChanged={onChanged} />
      ))}
    </div>
  );
}