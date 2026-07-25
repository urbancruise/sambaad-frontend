import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeActivity } from "../types";

interface ActivitiesState {
    activities: EmployeeActivity[];
    loading: boolean;
    error: string | null;
}

const initialState: ActivitiesState = {
    activities: [],
    loading: false,
    error: null,
};

const activitySlice = createSlice({
    // Unique name — avoids colliding with teamLead/profile's "activitySlice".
    name: "managerTeamLeadActivities",
    initialState,
    reducers: {
        fetchActivitiesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchActivitiesSuccess(state, action: PayloadAction<EmployeeActivity[]>) {
            state.loading = false;
            state.activities = action.payload;
        },
        fetchActivitiesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchActivitiesStart,
    fetchActivitiesSuccess,
    fetchActivitiesFailure,
} = activitySlice.actions;

export default activitySlice.reducer;