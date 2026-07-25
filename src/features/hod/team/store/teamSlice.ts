import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamLeadSummary } from "../type";

interface hodTeamState {
    teamLeads: TeamLeadSummary[];
    loading: boolean;
    error: string | null;
}

const initialState: hodTeamState = {
    teamLeads: [],
    loading: false,
    error: null,
};

const hodTeamSlice = createSlice({
    name: "hodTeam",
    initialState,
    reducers: {
        fetchTeamLeadsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTeamLeadsSuccess(state, action: PayloadAction<TeamLeadSummary[]>) {
            state.loading = false;
            state.teamLeads = action.payload;
        },
        fetchTeamLeadsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchTeamLeadsStart,
    fetchTeamLeadsSuccess,
    fetchTeamLeadsFailure,
} = hodTeamSlice.actions;

export default hodTeamSlice.reducer;