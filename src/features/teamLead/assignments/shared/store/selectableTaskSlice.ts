import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import {

    SelectableTask

} from "../types";

interface TaskState {

    tasks: SelectableTask[];

    loading: boolean;

}

const initialState: TaskState = {

    tasks: [],

    loading: false

};

const slice = createSlice({

    name: "selectableTasks",

    initialState,

    reducers: {

        fetchStart(state){

            state.loading = true;

        },

        fetchSuccess(

            state,

            action: PayloadAction<SelectableTask[]>

        ){

            state.loading = false;

            state.tasks = action.payload;

        },

        fetchFailure(state){

            state.loading = false;

        },

        clear(state){

            state.tasks = [];

        }

    }

});

export const {

    fetchStart,

    fetchSuccess,

    fetchFailure,

    clear

} = slice.actions;

export default slice.reducer;