import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { TeamTask } from "../type";

interface TaskState {

    tasks: TeamTask[];

    loading: boolean;

}

const initialState: TaskState = {

    tasks: [],

    loading: false

};

const slice = createSlice({

    name: "teamLeadTasks",

    initialState,

    reducers: {

        fetchStart(state){

            state.loading = true;

        },

        fetchSuccess(

            state,

            action: PayloadAction<TeamTask[]>

        ){

            state.loading = false;

            state.tasks = action.payload;

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