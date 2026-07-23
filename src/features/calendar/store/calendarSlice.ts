import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";

import {
    CalendarEvent,
} from "../types";

interface CalendarState {

    items: CalendarEvent[];

    loading: boolean;

    error: string | null;

}

const initialState: CalendarState = {

    items: [],

    loading: false,

    error: null,

};

const calendarSlice = createSlice({

    name: "calendar",

    initialState,

    reducers: {

        fetchCalendarStart(state) {

            state.loading = true;

            state.error = null;

        },

        fetchCalendarSuccess(

            state,

            action: PayloadAction<
                CalendarEvent[]
            >

        ) {

            state.loading = false;

            state.items =
                action.payload;

        },

        fetchCalendarFailure(

            state,

            action: PayloadAction<
                string
            >

        ) {

            state.loading = false;

            state.error =
                action.payload;

        },

        setCalendar(

            state,

            action: PayloadAction<
                CalendarEvent[]
            >

        ) {

            state.items =
                action.payload;

        },

    },

});

export const {

    fetchCalendarStart,

    fetchCalendarSuccess,

    fetchCalendarFailure,

    setCalendar,

} = calendarSlice.actions;

export default calendarSlice.reducer;