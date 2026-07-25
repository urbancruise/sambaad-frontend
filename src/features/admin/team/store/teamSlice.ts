import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrgUserSummary } from "../types";

interface AdminTeamState {
    users: OrgUserSummary[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminTeamState = {
    users: [],
    loading: false,
    error: null,
};

const adminTeamSlice = createSlice({
    // Unique name — avoids colliding with managerTeam/teamSlice elsewhere.
    name: "adminTeam",
    initialState,
    reducers: {
        fetchUsersStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess(state, action: PayloadAction<OrgUserSummary[]>) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchUsersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
} = adminTeamSlice.actions;

export default adminTeamSlice.reducer;