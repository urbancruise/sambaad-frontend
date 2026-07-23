"use client";

import { Trash2, Pencil } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { Goal } from "../types";
import { deleteGoal } from "../api/goal.service";
import { removeGoal } from "../store/goalSlice";

interface Props {
    goal: Goal;
    onEditClick: () => void;
}

export default function GoalActions({ goal, onEditClick }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const confirmed = window.confirm("Deconstruct this objective permanently?");
        if (!confirmed) return;

        try {
            await deleteGoal(goal.id);
            dispatch(removeGoal(goal.id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete goal.");
        }
    };

    return (
        <div className="flex gap-1">
            {/* Edit Control Icon Wrapper */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEditClick();
                }}
                title="Modify Parameters"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-150"
            >
                <Pencil size={13} strokeWidth={2.5} />
            </button>

            {/* Terminate Control Icon Wrapper */}
            <button
                onClick={handleDelete}
                title="Terminate Objective"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-150"
            >
                <Trash2 size={13} strokeWidth={2.5} />
            </button>
        </div>
    );
}