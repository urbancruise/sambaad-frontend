import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Goal, GoalState, Pagination } from "../types/index";

const initialState: GoalState = {
    goals: [],
    pagination: null,
    loading: false,
    error: null,
};

const goalSlice = createSlice({
    name: "goals",
    initialState,

    reducers: {
        fetchGoalsStart(state) {
            state.loading = true;
            state.error = null;
        },

        fetchGoalsSuccess(
            state,
            action: PayloadAction<{
                goals: Goal[];
                pagination: Pagination;
            }>
        ) {
            state.loading = false;
            state.goals = action.payload.goals;
            state.pagination = action.payload.pagination;
        },

        fetchGoalsFailure(
            state,
            action: PayloadAction<string>
        ) {
            state.loading = false;
            state.error = action.payload;
        },

        addGoal(state, action: PayloadAction<Goal>) {
            state.goals.unshift(action.payload);
        },

        updateGoals(
            state,
            action: PayloadAction<Goal>
        ) {
            const index = state.goals.findIndex(
                (g) => g.id === action.payload.id
            );

            if (index !== -1) {
                state.goals[index] = action.payload;
            }
        },

        removeGoal(
            state,
            action: PayloadAction<string>
        ) {
            state.goals = state.goals.filter(
                (g) => g.id !== action.payload
            );
        },
    },
});

export const {
    fetchGoalsStart,
    fetchGoalsSuccess,
    fetchGoalsFailure,
    addGoal,
    updateGoals,
    removeGoal,
} = goalSlice.actions;

export default goalSlice.reducer;