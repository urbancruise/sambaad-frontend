import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import { EmployeeActivity } from "../types";

interface ActivityState {

    activities: EmployeeActivity[];

    loading: boolean;

    error: string | null;

}

const initialState: ActivityState = {

    activities: [],

    loading: false,

    error: null

};

const activitySlice = createSlice({

    name: "employeeActivities",

    initialState,

    reducers: {

        fetchActivitiesStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchActivitiesSuccess(

            state,

            action: PayloadAction<EmployeeActivity[]>

        ) {

            state.loading = false;

            state.activities = action.payload;

        },

        fetchActivitiesFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

        }

    }

});

export const {

    fetchActivitiesStart,

    fetchActivitiesSuccess,

    fetchActivitiesFailure

} = activitySlice.actions;

export default activitySlice.reducer;