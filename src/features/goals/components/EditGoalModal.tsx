"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { X, Sliders } from "lucide-react";

import { AppDispatch } from "@/src/lib/store";
import GoalForm from "./GoalForm";
import { updateGoal } from "../api/goal.service";
import { updateGoals } from "../store/goalSlice";
import { Goal } from "../types";

interface Props {
    open: boolean;
    goal: Goal;
    onClose: () => void;
}

export default function EditGoalModal({ open, goal, onClose }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!open || !mounted) return null;

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const updatedGoal = await updateGoal(goal.id, values);
            dispatch(updateGoals(updatedGoal));
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
            {/* Blurry Mainframe Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-100/10 backdrop-blur-xs transition-opacity animate-[fadeIn_0.2s_ease-out]" 
                onClick={onClose} 
            />

            {/* Cyberpunk Modal Box Frame */}
             <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800/90 bg-white backdrop-blur-xs p-5 md:p-5 text-slate-900 shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-[scaleUp_0.25s_ease-out]">
                {/* Visual Neon Corner Accents */}
                <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-r from-transparent to-cyan-500" />
                <div className="absolute top-0 right-0 w-[2px] h-32 bg-gradient-to-b from-cyan-500 to-transparent" />

                {/* Header Matrix Panel */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <Sliders size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold tracking-wide text-black  font-mono">
                                Edit Your Goals
                            </h2>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-900 border border-slate-800/50 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-200"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form Processing Terminal */}
                <div className="text-slate-200">
                    <GoalForm
                        loading={loading}
                        onSubmit={handleSubmit}
                        defaultValues={{
                            title: goal.title,
                            description: goal.description ?? "",
                            goalType: goal.goalType,
                            priority: goal.priority,
                            startDate: goal.startDate.split("T")[0],
                            dueDate: goal.dueDate.split("T")[0],
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}