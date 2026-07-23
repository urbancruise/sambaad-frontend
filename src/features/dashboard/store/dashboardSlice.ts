import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeDashboard } from "@/src/features/dashboard/types";

interface DashboardState {
    dashboard: EmployeeDashboard | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    dashboard: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState,

    reducers: {

        fetchDashboardStart(state) {
            state.loading = true;
            state.error = null;
        },

        fetchDashboardSuccess(
            state,
            action: PayloadAction<EmployeeDashboard>
        ) {
            state.loading = false;
            state.dashboard = action.payload;
            state.error = null;
        },

        fetchDashboardFailure(
            state,
            action: PayloadAction<string>
        ) {
            state.loading = false;
            state.error = action.payload;
        },

        clearDashboard(state) {
            state.dashboard = null;
            state.error = null;
            state.loading = false;
        },

    },

});

export const {
    fetchDashboardStart,
    fetchDashboardSuccess,
    fetchDashboardFailure,
    clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;