"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import {
    fetchGoalsStart,
    fetchGoalsSuccess,
    fetchGoalsFailure,
} from "../store/goalSlice";
import { getGoals } from "../api/goal.service";
import { useGoals } from "../hooks/useGoals";
import CreateGoalModal from "../components/CreateGoalModal";
import EditGoalModal from "../components/EditGoalModal"; 
import { useTasks } from "../../tasks/hooks/useTask";
import GoalWithTasks from "../components/GoalWithTasks";
import { Goal } from "../types";

export default function GoalsPage() {
    const { tasks } = useTasks();
    const [openCreate, setOpenCreate] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const dispatch = useDispatch<AppDispatch>();
    const { goals, loading } = useGoals();

    useEffect(() => {
        const loadGoals = async () => {
            dispatch(fetchGoalsStart());
            try {
                const response = await getGoals();
                dispatch(
                    fetchGoalsSuccess({
                        goals: response.goals,
                        pagination: response.pagination,
                    })
                );
            } catch (error: any) {
                dispatch(fetchGoalsFailure(error.message));
            }
        };
        loadGoals();
    }, [dispatch]);

    // Filter logic mapping goal.type safely
    const filteredGoals = goals.filter((goal) => {
        if (activeFilter === "all") return true;
        return goal.goalType?.toLowerCase() === activeFilter.toLowerCase();
    });

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin"></div>
                </div>
            </div>
        ); 
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] p-4 text-slate-800 rounded-2xl">
            <div className="grid grid-cols-4 gap-3 mb-3">
                <button
                    onClick={() => setActiveFilter("all")}
                    className={`py-1 h-10 rounded-2xl font-bold text-center tracking-wide text-lg transition-all shadow-sm ${
                        activeFilter === "all"
                            ? "bg-slate-700 text-white shadow-md scale-102"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    All Goals
                </button>
                <button
                    onClick={() => setActiveFilter("LONG_TERM")}
                    className={`py-1 h-10 rounded-2xl font-bold text-center tracking-wide text-lg transition-all shadow-sm ${
                        activeFilter === "LONG_TERM"
                            ? "bg-[#3bc4d9] text-slate-900 shadow-md scale-102"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    longTerm
                </button>
                <button
                    onClick={() => setActiveFilter("onGoing")}
                    className={`py-1 h-10 rounded-2xl font-bold text-center tracking-wide text-lg transition-all shadow-sm ${
                        activeFilter === "onGoing"
                            ? "bg-[#fcc419] text-slate-900 shadow-md scale-102"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    onGoing
                </button>
                <button
                    onClick={() => setActiveFilter("urgent")}
                    className={`py-1 h-10 rounded-2xl font-bold text-center tracking-wide text-lg transition-all shadow-sm ${
                        activeFilter === "urgent"
                            ? "bg-[#e64980] text-white shadow-md scale-102"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    urgent
                </button>
            </div>

            <CreateGoalModal open={openCreate} onClose={() => setOpenCreate(false)} />
            
            {editingGoal && (
                <EditGoalModal 
                    open={true} 
                    goal={editingGoal} 
                    onClose={() => setEditingGoal(null)} 
                />
            )}

            {/* Grid Layout for Rendered Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map((goal) => {
                    const goalTasks = tasks.filter((task) => task.goalId === goal.id);

                    return (
                        <div key={goal.id} className="transition-all duration-300">
                            <GoalWithTasks 
                                goal={goal} 
                                tasks={goalTasks} 
                                onEditSelect={() => setEditingGoal(goal)}
                            />
                        </div>
                    );
                })}
            </div>

            {filteredGoals.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-white shadow-inner">
                    <p className="text-slate-400 font-medium text-sm">No operational parameters detected under this category.</p>
                </div>
            )}
        </div>
    );
}
