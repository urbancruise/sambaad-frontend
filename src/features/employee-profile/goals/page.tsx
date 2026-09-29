"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import GoalFilters from "./components/GoalFilter";
import GoalTable from "./components/GoalTable";
import CreateEmployeeGoalModal from "./components/CreateEmployeeGoalModal";

import { useEmployeeGoals } from "./hooks/useEmployeeGoals";

export default function GoalPage() {
  const { goals, loading, refreshGoals } = useEmployeeGoals();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch = goal.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === "ALL" || goal.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [goals, search, status]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center w-full">
        <GoalFilters
          search={search}
          status={status}
          onSearch={setSearch}
          onStatusChange={setStatus}
        />

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition active:scale-95"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      <GoalTable
        goals={filteredGoals}
        loading={loading}
        onChanged={refreshGoals}
      />

      <CreateEmployeeGoalModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refreshGoals}
      />
    </div>
  );
}