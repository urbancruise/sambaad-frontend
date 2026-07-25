import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeGoal } from "../types";

interface GoalsState {
    goals: EmployeeGoal[];
    loading: boolean;
    error: string | null;
}

const initialState: GoalsState = {
    goals: [],
    loading: false,
    error: null,
};

const goalSlice = createSlice({
    // Unique name — avoids colliding with teamLead/profile's "goalSlice".
    name: "managerTeamLeadGoals",
    initialState,
    reducers: {
        fetchGoalsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchGoalsSuccess(state, action: PayloadAction<EmployeeGoal[]>) {
            state.loading = false;
            state.goals = action.payload;
        },
        fetchGoalsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchGoalsStart,
    fetchGoalsSuccess,
    fetchGoalsFailure,
} = goalSlice.actions;

export default goalSlice.reducer;