"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { X, Terminal } from "lucide-react";

import { AppDispatch } from "@/src/lib/store";
import { useTasks } from "../../tasks/hooks/useTask";
import ActivityForm from "./ActivityForm";
import { ActivityFormValues } from "../schema/activity.schema";
import { createActivity } from "../api/activity.service";
import { addActivity } from "../store/activitySlice";

interface Props {
    open: boolean;
    onClose: () => void;
    taskId?: string;
}

export default function CreateActivityModal({ open, onClose, taskId }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks } = useTasks();
    const [loading, setLoading] = useState(false);
    
    // Protection guard against hydration mismatch warnings
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!open || !mounted) return null;

    const handleSubmit = async (values: ActivityFormValues) => {
        try {
            setLoading(true);
            const activity = await createActivity(values);
            dispatch(addActivity(activity));
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
            {/* Blurry Mainframe Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl transition-opacity animate-[fadeIn_0.2s_ease-out]" 
                onClick={onClose} 
            />

            {/* Cyberpunk Modal Box Frame */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800/90 bg-white/95 backdrop-blur-2xl p-8 text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-[scaleUp_0.25s_ease-out]">
                {/* Visual Neon Corner Accents */}
                <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-r from-transparent to-emerald-500" />
                <div className="absolute top-0 right-0 w-[2px] h-32 bg-gradient-to-b from-emerald-500 to-transparent" />

                {/* Header Matrix Panel */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                    <div className="flex items-center gap-2">
                        <Terminal size={18} className="text-emerald-400" />
                        <h2 className="text-xl font-bold tracking-wide text-black">
                            Add Activity
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Component Form Wrapper */}
                <ActivityForm
                    tasks={tasks}
                    defaultValues={{
                        taskId,
                    }}
                    loading={loading}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>,
        document.body
    );
}