"use client";

import ActivityForm from "./ActivityForm";

import { useCreateActivity } from "../hooks/useTeamLeadDashboard";

interface Props {

    taskId: string;

}

export default function CreateActivityPage({

    taskId

}: Props) {

    const {

        loading,

        submit

    } = useCreateActivity();

    return (

        <ActivityForm

            taskId={taskId}

            loading={loading}

            onSubmit={submit}

        />

    );

}