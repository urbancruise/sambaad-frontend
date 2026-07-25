"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/lib/store";

import { getMyTeamLeads } from "../api/team.service";
import {
    fetchTeamLeadsStart,
    fetchTeamLeadsSuccess,
    fetchTeamLeadsFailure,
} from "../store/teamSlice";

export const useManagerTeam = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { teamLeads, loading, error } = useSelector(
        (state: RootState) => state.managerTeam
    );

    const refreshTeamLeads = useCallback(async () => {
        dispatch(fetchTeamLeadsStart());
        try {
            const data = await getMyTeamLeads();
            dispatch(fetchTeamLeadsSuccess(data));
        } catch {
            dispatch(fetchTeamLeadsFailure("Unable to load your team leads."));
        }
    }, [dispatch]);

    useEffect(() => {
        refreshTeamLeads();
    }, [refreshTeamLeads]);

    return { teamLeads, loading, error, refreshTeamLeads };
};