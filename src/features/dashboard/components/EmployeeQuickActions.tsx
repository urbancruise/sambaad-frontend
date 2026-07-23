"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CalendarPlus, ListPlus, Target } from "lucide-react";

import type { AppDispatch } from "@/src/lib/store";
import CreateGoalModal from "@/src/features/goals/components/CreateGoalModal";
import CreateTaskModal from "@/src/features/tasks/components/CreateTaskModal";
import CreateActivityModal from "@/src/features/activities/components/CreateActivityModal";
import { getGoals } from "@/src/features/goals/api/goal.service";
import { getTasks } from "@/src/features/tasks/api/task.service";
import {
    fetchGoalsFailure,
    fetchGoalsStart,
    fetchGoalsSuccess,
} from "@/src/features/goals/store/goalSlice";
import {
    setLoading,
    setTasks,
} from "@/src/features/tasks/store/taskSlice";

type ModalName = "goal" | "task" | "activity" | null;

interface Props {
    onChanged?: () => void;
}

const actions = [
    {
        key: "goal" as const,
        label: "Goal",
        icon: Target,
    },
    {
        key: "task" as const,
        label: "Task",
        icon: ListPlus,
    },
    {
        key: "activity" as const,
        label: "Activity",
        icon: CalendarPlus,
    },
];

export default function EmployeeQuickActions({
    onChanged,
}: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [openModal, setOpenModal] =
        useState<ModalName>(null);

    useEffect(() => {
        const loadFormData = async () => {
            dispatch(fetchGoalsStart());
            dispatch(setLoading(true));

            try {
                const [goals, tasks] =
                    await Promise.all([
                        getGoals({
                            limit: 50,
                        }),
                        getTasks({
                            limit: 50,
                        }),
                    ]);

                dispatch(fetchGoalsSuccess(goals));
                dispatch(setTasks(tasks));
            } catch {
                dispatch(
                    fetchGoalsFailure(
                        "Unable to load form data"
                    )
                );
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadFormData();
    }, [dispatch]);

    const closeModal = () => {
        setOpenModal(null);
        onChanged?.();
    };

    return (
        <div className="flex flex-wrap gap-3">
            {actions.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => setOpenModal(key)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                >
                    <Icon size={16} />
                    Add {label}
                </button>
            ))}

            <CreateGoalModal
                open={openModal === "goal"}
                onClose={closeModal}
            />

            <CreateTaskModal
                open={openModal === "task"}
                onClose={closeModal}
            />

            <CreateActivityModal
                open={openModal === "activity"}
                onClose={closeModal}
            />
        </div>
    );
}
