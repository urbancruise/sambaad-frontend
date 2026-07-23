import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { TeamMember } from "../types";

interface TeamState {

    members: TeamMember[];

    loading: boolean;

}

const initialState: TeamState = {

    members: [],

    loading: false

};

const slice = createSlice({

    name: "teamMembers",

    initialState,

    reducers: {

        fetchStart(state){

            state.loading = true;

        },

        fetchSuccess(

            state,

            action: PayloadAction<TeamMember[]>

        ){

            state.loading = false;

            state.members = action.payload;

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