import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeTask } from "../type";

interface TasksState {
    tasks: EmployeeTask[];
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    // Unique name — avoids colliding with teamLead/profile's "taskSlice".
    name: "managerTeamLeadTasks",
    initialState,
    reducers: {
        fetchTasksStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTasksSuccess(state, action: PayloadAction<EmployeeTask[]>) {
            state.loading = false;
            state.tasks = action.payload;
        },
        fetchTasksFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchTasksStart,
    fetchTasksSuccess,
    fetchTasksFailure,
} = taskSlice.actions;

export default taskSlice.reducer;