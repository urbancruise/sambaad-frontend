import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailState {
    unreadCount: number;
}

const initialState: EmailState = {
    unreadCount: 0,
};

const emailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        incrementUnread(state) {
            state.unreadCount += 1;
        },
    },
});

export const { setUnreadCount, incrementUnread } = emailSlice.actions;
export default emailSlice.reducer;