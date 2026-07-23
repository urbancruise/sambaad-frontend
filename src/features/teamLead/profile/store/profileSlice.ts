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

    name: "employeeProfile",

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