import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

import { TeamMember } from "../types";

interface TeamState {

    members: TeamMember[];

    loading: boolean;

    error: string | null;

}

const initialState: TeamState = {

    members: [],

    loading: false,

    error: null

};

const teamSlice = createSlice({

    name: "team",

    initialState,

    reducers: {

        fetchTeamStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchTeamSuccess(

            state,

            action: PayloadAction<TeamMember[]>

        ) {

            state.loading = false;

            state.members = action.payload;

        },

        fetchTeamFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

        }

    }

});

export const {

    fetchTeamStart,

    fetchTeamSuccess,

    fetchTeamFailure

} = teamSlice.actions;

export default teamSlice.reducer;