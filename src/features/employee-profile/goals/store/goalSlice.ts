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
    // Shared by admin / hod / manager — store key must match this name.
    name: "sharedEmployeeGoals",
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