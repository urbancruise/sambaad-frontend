import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";

import { Notification } from "../types";

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notification",

    initialState,

    reducers: {

        setNotifications(
            state,
            action: PayloadAction<Notification[]>
        ) {
            state.notifications = action.payload;
        },

        markRead(
            state,
            action: PayloadAction<string>
        ) {
            state.notifications =
                state.notifications.map((n) =>
                    n.id === action.payload
                        ? {
                              ...n,
                              isRead: true,
                          }
                        : n
                );
        },

        markAll(state) {
            state.notifications =
                state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }));
        },

    },

});

export const {
    setNotifications,
    markRead,
    markAll,
} = notificationSlice.actions;

export default notificationSlice.reducer;