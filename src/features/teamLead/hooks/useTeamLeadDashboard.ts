"use client";

import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {
    AppDispatch,
    RootState
} from "@/src/lib/store";

import {
    start,
    success,
    failure
} from "../store/teamLeadDashboardSlice";

import { getTeamLeadDashboard, createGoal, createTask, createActivity} from "../api/teamLeadDashboard.service";

export const useTeamLeadDashboard = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const {
        dashboard,
        loading,
        error
    } = useSelector(
        (state: RootState) =>
            state.teamLeadDashboard
    );

    const refreshDashboard =
        useCallback(async () => {

            dispatch(start());

            try {

                const data =
                    await getTeamLeadDashboard();

                dispatch(
                    success(data)
                );

            } catch {

                dispatch(
                    failure(
                        "Unable to load dashboard"
                    )
                );

            }

        }, [dispatch]);

    useEffect(() => {

        refreshDashboard();

    }, [refreshDashboard]);

    return {

        dashboard,

        loading,

        error,

        refreshDashboard

    };

};

export const useCreateGoal = () => {

    const [loading, setLoading] = useState(false);

    const submit = async (data: any) => {

        setLoading(true);

        try {

            await createGoal(data);

        } finally {

            setLoading(false);

        }

    };

    return {
        loading,
        submit
    };

};

export const useCreateTask = () => {

    const [loading, setLoading] = useState(false);

    const submit = async (data: any) => {

        setLoading(true);

        try {

            await createTask(data);

        } finally {

            setLoading(false);

        }

    };

    return {

        loading,

        submit

    };

};

export const useCreateActivity = () => {

    const [loading, setLoading] = useState(false);

    const submit = async (data: any) => {

        setLoading(true);

        try {

            await createActivity(data);

        } finally {

            setLoading(false);

        }

    };

    return {

        loading,

        submit

    };

};