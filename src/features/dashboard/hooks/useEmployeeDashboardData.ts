"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/src/lib/store";
import { updateActivity } from "@/src/features/activities/api/activity.service";
import {
    fetchDashboardFailure,
    fetchDashboardStart,
    fetchDashboardSuccess,
} from "../store/dashboardSlice";
import { getEmployeeDashboard } from "../api/dashboard.service";
import { useDashboard } from "./useDashboard";

export const useEmployeeDashboardData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [updatingActivityId, setUpdatingActivityId] =
        useState<string | null>(null);

    const dashboardState = useDashboard();

    const refreshDashboard = useCallback(async () => {
        dispatch(fetchDashboardStart());

        try {
            const data = await getEmployeeDashboard();
            dispatch(fetchDashboardSuccess(data));
        } catch {
            dispatch(
                fetchDashboardFailure(
                    "Unable to load dashboard"
                )
            );
        }
    }, [dispatch]);

    const completeTodayActivity = useCallback(
        async (activityId: string) => {
            setUpdatingActivityId(activityId);

            try {
                await updateActivity(activityId, {
                    status: "COMPLETED",
                });

                await refreshDashboard();
            } finally {
                setUpdatingActivityId(null);
            }
        },
        [refreshDashboard]
    );

    useEffect(() => {
        refreshDashboard();
    }, [refreshDashboard]);

    return {
        ...dashboardState,
        updatingActivityId,
        completeTodayActivity,
        refreshDashboard,
    };
};
