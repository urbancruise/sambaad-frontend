import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { EmployeeProfile } from "../type";

interface ProfileState {

    profile: EmployeeProfile | null;

    loading: boolean;

    error: string | null;

}

const initialState: ProfileState = {

    profile: null,

    loading: false,

    error: null

};

const profileSlice = createSlice({

    // Was "employeeProfile" — identical to teamLead/profile's slice name,
    // which caused every dispatched action here to also hit that slice's
    // reducers (and vice versa). Renamed to keep the two isolated.
    name: "managerTeamLeadProfile",

    initialState,

    reducers: {

        fetchProfileStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchProfileSuccess(

            state,

            action: PayloadAction<EmployeeProfile>

        ) {

            state.loading = false;

            state.profile = action.payload;

        },

        fetchProfileFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

        }

    }

});

export const {

    fetchProfileStart,

    fetchProfileSuccess,

    fetchProfileFailure

} = profileSlice.actions;

export default profileSlice.reducer;