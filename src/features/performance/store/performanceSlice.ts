import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";

import {
    Achievement,
    PerformanceAnalytics,
    PerformanceDashboard,
} from "../types";

interface PerformanceState {

    dashboard: PerformanceDashboard | null;

    achievements: Achievement[];

    analytics: PerformanceAnalytics | null;

    loading: boolean;

    error: string | null;

}

const initialState: PerformanceState = {

    dashboard: null,

    achievements: [],

    analytics: null,

    loading: false,

    error: null,

};

const performanceSlice = createSlice({

    name: "performance",

    initialState,

    reducers: {

        fetchPerformanceStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchPerformanceSuccess(

            state,

            action: PayloadAction<{

                dashboard: PerformanceDashboard;

                achievements: Achievement[];

                analytics: PerformanceAnalytics;

            }>

        ) {

            state.loading = false;

            state.dashboard =
                action.payload.dashboard;

            state.achievements =
                action.payload.achievements;

            state.analytics =
                action.payload.analytics;

        },

        fetchPerformanceFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error =
                action.payload;

        },

    },

});

export const {

    fetchPerformanceStart,

    fetchPerformanceSuccess,

    fetchPerformanceFailure,

} = performanceSlice.actions;

export default performanceSlice.reducer;