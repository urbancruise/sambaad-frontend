"use client";

import TaskForm from "./TaskForm";

import { useCreateTask } from "../hooks/useTeamLeadDashboard";

interface Props {

    goalId: string;

}

export default function CreateTaskPage({

    goalId

}: Props) {

    const {

        loading,

        submit

    } = useCreateTask();

    return (

        <TaskForm

            goalId={goalId}

            loading={loading}

            onSubmit={submit}

        />

    );

}