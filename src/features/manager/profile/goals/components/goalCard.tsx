"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, Plus, Calendar } from "lucide-react";

import { RootState } from "@/src/lib/store";
import { EmployeeGoal } from "../types";
import CreateEmployeeTaskModal from "./CreateEmployeeGoalModal";
import EditEmployeeGoalModal from "./EditEmployeeGoalModal";
import { deleteEmployeeGoal } from "../api/goal.service";

interface Props {
  goal: EmployeeGoal;
  onChanged?: () => void;
}

interface ThemeProps {
  btnBg: string;
  textColor: string;
  borderColor: string;
  ringColor: string;
}

const themeConfig: Record<string, ThemeProps> = {
  LONG_TERM: {
    btnBg: "bg-[#3bc4d9] hover:bg-[#2eb0c4] text-white",
    textColor: "text-[#1092a5]",
    borderColor: "border-[#3bc4d9]",
    ringColor: "stroke-[#3bc4d9]",
  },
  ONGOING: {
    btnBg: "bg-[#fcc419] hover:bg-[#e5b212] text-slate-900",
    textColor: "text-[#b28904]",
    borderColor: "border-[#fcc419]",
    ringColor: "stroke-[#fcc419]",
  },
  URGENT: {
    btnBg: "bg-[#e64980] hover:bg-[#d4376f] text-white",
    textColor: "text-[#c2215b]",
    borderColor: "border-[#e64980]",
    ringColor: "stroke-[#e64980]",
  },
  SHORT_TERM: {
    btnBg: "bg-indigo-500 hover:bg-indigo-600 text-white",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-400",
    ringColor: "stroke-indigo-500",
  },
  default: {
    btnBg: "bg-slate-800 hover:bg-slate-900 text-white",
    textColor: "text-slate-600",
    borderColor: "border-slate-300",
    ringColor: "stroke-slate-500",
  },
};

const statusColor = {
  PENDING: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_PROGRESS: "bg-sky-50 text-sky-600 border border-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-600 border border-rose-200",
};

const priorityColor = {
  LOW: "bg-blue-50 text-blue-600 border border-blue-200",
  MEDIUM: "bg-amber-50 text-amber-600 border border-amber-200",
  HIGH: "bg-orange-50 text-orange-600 border border-orange-200",
  CRITICAL: "bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider animate-pulse",
};

const goalTypeColors: Record<string, string> = {
  LONG_TERM: "bg-purple-50 text-purple-600 border border-purple-200",
  ONGOING: "bg-teal-50 text-teal-600 border border-teal-200",
  URGENT: "bg-rose-50 text-rose-600 border border-rose-200",
  SHORT_TERM: "bg-indigo-50 text-indigo-600 border border-indigo-200",
};

export default function GoalCard({ goal, onChanged }: Props) {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const isCreator = goal.createdById === currentUserId;
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const goalTypeKey = goal.goalType ? String(goal.goalType) : "default";
  const theme = themeConfig[goalTypeKey] || themeConfig.default;

  const progressPercent =
    goal.progress ??
    (goal.taskCount && goal.taskCount > 0
      ? Math.round(((goal.completedTasks || 0) / goal.taskCount) * 100)
      : 0);

  const handleDelete = async () => {
    const ok = window.confirm(
      "Delete this goal? This will also delete its tasks and activities."
    );
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteEmployeeGoal(goal.id);
      onChanged?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full relative bg-white rounded-3xl p-5 shadow-[0_6px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.07)] transition-all duration-300 border border-slate-100/90 flex flex-col justify-between min-h-[260px]">
      <div>
        {/* Header Badges & Actions */}
        <div className="flex justify-between items-center mb-3 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                goal.priority
                  ? priorityColor[
                      goal.priority as keyof typeof priorityColor
                    ] || "bg-slate-100 text-slate-500"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {goal.priority || "No Priority"}
            </span>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                goal.goalType
                  ? goalTypeColors[goal.goalType] ||
                    "bg-slate-100 text-slate-600 border border-slate-200"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {goal.goalType ? goal.goalType.replace("_", " ") : "Goal Type"}
            </span>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                goal.status
                  ? statusColor[goal.status as keyof typeof statusColor] ||
                    "bg-slate-100 text-slate-500"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {goal.status}
            </span>
          </div>

          {/* Action buttons */}
          {isCreator && (
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                title="Edit goal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xs transition active:scale-90"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete goal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-xs transition active:scale-90 disabled:opacity-40"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-800 mb-3.5 tracking-tight line-clamp-1">
          {goal.title || "Untitled Objective"}
        </h2>

        {/* Subunits & Progress Ring */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full border-[3.5px] ${theme.borderColor} flex items-center justify-center font-black text-slate-800 text-sm bg-white shadow-xs`}
            >
              {goal.completedTasks || 0}
              <span className="text-[11px] text-slate-400 font-bold">
                /{goal.taskCount || 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-700 text-xs font-bold tracking-tight">
                Subunits
              </span>
              <span className="text-[11px] text-slate-400">tasks done</span>
            </div>
          </div>

          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="stroke-slate-100"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${theme.ringColor} transition-all duration-500`}
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-700">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer Row */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100/80 gap-2">
        <button
          onClick={() => setAddTaskOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 ${theme.btnBg}`}
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>

        {/* Start and Due Date Badges */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <Calendar size={11} className="text-slate-400" />
            <span>
              Start:{" "}
              <strong className="text-slate-700">
                {goal.startDate
                  ? new Date(goal.startDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <Calendar size={11} className="text-slate-400" />
            <span>
              Due:{" "}
              <strong className="text-slate-700">
                {goal.dueDate
                  ? new Date(goal.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Modals */}
      <CreateEmployeeTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onCreated={() => onChanged?.()}
        defaultGoalId={goal.id}
      />

      {isCreator && (
        <EditEmployeeGoalModal
          open={editOpen}
          goal={goal}
          onClose={() => setEditOpen(false)}
          onUpdated={() => onChanged?.()}
        />
      )}
    </div>
  );
}