import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    Activity,
    ActivityResponse,
} from "../types";

interface ActivityState {

    activities: Activity[];

    pagination: ActivityResponse["pagination"] | null;

    loading: boolean;

    error: string | null;

}

const initialState: ActivityState = {

    activities: [],

    pagination: null,

    loading: false,

    error: null,

};

const activitySlice = createSlice({

    name: "activity",

    initialState,

    reducers: {

        fetchActivitiesStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchActivitiesSuccess(

            state,

            action: PayloadAction<ActivityResponse>

        ) {

            state.loading = false;

            state.activities =
                action.payload.activities;

            state.pagination =
                action.payload.pagination;

        },

        fetchActivitiesFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

        },

        addActivity(

            state,

            action: PayloadAction<Activity>

        ) {

            state.activities.unshift(
                action.payload
            );

        },

        updateActivity(

            state,

            action: PayloadAction<Activity>

        ) {

            state.activities =
                state.activities.map((activity) =>

                    activity.id === action.payload.id
                        ? action.payload
                        : activity

                );

        },

        deleteActivity(

            state,

            action: PayloadAction<string>

        ) {

            state.activities =
                state.activities.filter(

                    (activity) =>
                        activity.id !==
                        action.payload

                );

        },
        resetActivities(state){
            state.activities=[];
            state.pagination=null;
            state.loading=false;
            state.error=null;
        },
    },

});

export const {

    fetchActivitiesStart,
    resetActivities,

    fetchActivitiesSuccess,

    fetchActivitiesFailure,

    addActivity,

    updateActivity,

    deleteActivity,

} = activitySlice.actions;

export default activitySlice.reducer;