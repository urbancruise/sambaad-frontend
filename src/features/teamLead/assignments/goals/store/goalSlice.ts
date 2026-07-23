import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { TeamGoal } from "../types";

interface GoalState {

    goals: TeamGoal[];

    loading: boolean;

}

const initialState: GoalState = {

    goals: [],

    loading: false

};

const slice = createSlice({

    name: "teamLeadGoals",

    initialState,

    reducers: {

        fetchStart(state){

            state.loading = true;

        },

        fetchSuccess(

            state,

            action: PayloadAction<TeamGoal[]>

        ){

            state.loading = false;

            state.goals = action.payload;

        },

        fetchFailure(state){

            state.loading = false;

        }

    }

});

export const {

    fetchStart,

    fetchSuccess,

    fetchFailure

} = slice.actions;

export default slice.reducer;