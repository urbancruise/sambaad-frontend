import {

    createSlice,

    PayloadAction

} from "@reduxjs/toolkit";

import {

    EmployeeTimeline

} from "../types";

interface TimelineState {

    timeline: EmployeeTimeline[];

    loading: boolean;

    error: string | null;

}

const initialState: TimelineState = {

    timeline: [],

    loading: false,

    error: null

};

const timelineSlice = createSlice({

    name: "employeeTimeline",

    initialState,

    reducers: {

        fetchTimelineStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchTimelineSuccess(

            state,

            action: PayloadAction<EmployeeTimeline[]>

        ) {

            state.loading = false;

            state.timeline = action.payload;

        },

        fetchTimelineFailure(

            state,

            action: PayloadAction<string>

        ) {

            state.loading = false;

            state.error = action.payload;

        }

    }

});

export const {

    fetchTimelineStart,

    fetchTimelineSuccess,

    fetchTimelineFailure

} = timelineSlice.actions;

export default timelineSlice.reducer;