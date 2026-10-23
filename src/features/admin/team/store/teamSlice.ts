import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrgUserSummary, PaginatedUsers } from "../types";

interface AdminTeamState {
    users: OrgUserSummary[];
    total: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
}

const initialState: AdminTeamState = { users: [], total: 0, totalPages: 1, loading: false, error: null };

const adminTeamSlice = createSlice({
    name: "adminTeam",
    initialState,
    reducers: {
        fetchUsersStart(state) { state.loading = true; state.error = null; },
        fetchUsersSuccess(state, action: PayloadAction<PaginatedUsers>) {
            state.loading = false;
            state.users = action.payload.items;
            state.total = action.payload.total;
            state.totalPages = action.payload.totalPages;
        },
        fetchUsersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } = adminTeamSlice.actions;
export default adminTeamSlice.reducer;