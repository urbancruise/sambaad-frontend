import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamLeadSummary } from "../type";

interface ManagerTeamState {
    teamLeads: TeamLeadSummary[];
    loading: boolean;
    error: string | null;
}

const initialState: ManagerTeamState = {
    teamLeads: [],
    loading: false,
    error: null,
};

const managerTeamSlice = createSlice({
    name: "managerTeam",
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
} = managerTeamSlice.actions;

export default managerTeamSlice.reducer;