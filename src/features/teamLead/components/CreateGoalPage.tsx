"use client";

import GoalForm from "./GoalForm";

import { useCreateGoal } from "../hooks/useTeamLeadDashboard";

export default function CreateGoalPage() {

    const {

        loading,

        submit

    } = useCreateGoal();

    return (

        <GoalForm

            loading={loading}

            onSubmit={submit}

        />

    );

}