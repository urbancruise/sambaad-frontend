"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/lib/store";

import { getAllUsers } from "../api/team.service";
import {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
} from "../store/teamSlice";

export const useAdminTeam = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { users, loading, error } = useSelector(
        (state: RootState) => state.adminTeam
    );

    const refreshUsers = useCallback(async () => {
        dispatch(fetchUsersStart());
        try {
            const data = await getAllUsers();
            dispatch(fetchUsersSuccess(data));
        } catch {
            dispatch(fetchUsersFailure("Unable to load org users."));
        }
    }, [dispatch]);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    return { users, loading, error, refreshUsers };
};