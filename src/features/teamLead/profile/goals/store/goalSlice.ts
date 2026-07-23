import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

import { EmployeeGoal } from "../types";

interface GoalState {

    goals: EmployeeGoal[];

    loading: boolean;

    error: string | null;

}

const initialState: GoalState = {

    goals: [],

    loading: false,

    error: null

};


const goalSlice = createSlice({

    name: "employeeGoals",

    initialState,

    reducers: {

        fetchGoalsStart(state) {

            state.loading = true;

            state.error = null;

            // Clear previous employee goals
            state.goals = [];

        },


        fetchGoalsSuccess(

            state,

            action: PayloadAction<EmployeeGoal[]>

        ) {

            state.loading = false;

            state.error = null;

            state.goals = action.payload;

        },


        fetchGoalsFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

            state.goals = [];

        },


        clearGoals(state) {

            state.goals = [];

            state.loading = false;

            state.error = null;

        }

    }

});


export const {

    fetchGoalsStart,

    fetchGoalsSuccess,

    fetchGoalsFailure,

    clearGoals

} = goalSlice.actions;


export default goalSlice.reducer;