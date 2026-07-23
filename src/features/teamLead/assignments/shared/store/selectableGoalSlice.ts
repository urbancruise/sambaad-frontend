import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { SelectableGoal } from "../types";

interface GoalState {

    goals: SelectableGoal[];

    loading: boolean;

}

const initialState: GoalState = {

    goals: [],

    loading: false

};

const slice = createSlice({

    name: "selectableGoals",

    initialState,

    reducers: {

        fetchStart(state){

            state.loading = true;

        },

        fetchSuccess(

            state,

            action: PayloadAction<SelectableGoal[]>

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