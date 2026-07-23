import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    Pagination,
    Task,
} from "../types";

interface TaskState {

    tasks: Task[];

    pagination: Pagination | null;

    loading: boolean;

}

const initialState: TaskState = {

    tasks: [],

    pagination: null,

    loading: false,

};

const taskSlice = createSlice({

    name: "task",

    initialState,

    reducers: {

        setLoading(
            state,
            action: PayloadAction<boolean>
        ) {
            state.loading = action.payload;
        },

        setTasks(
            state,
            action: PayloadAction<{
                tasks: Task[];
                pagination: Pagination;
            }>
        ) {

            state.tasks = action.payload.tasks;

            state.pagination =
                action.payload.pagination;

        },

        addTask(
            state,
            action: PayloadAction<Task>
        ) {

            state.tasks.unshift(
                action.payload
            );

        },

        updateTask(
            state,
            action: PayloadAction<Task>
        ) {

            state.tasks =
                state.tasks.map((task) =>
                    task.id === action.payload.id
                        ? action.payload
                        : task
                );

        },

        removeTask(
            state,
            action: PayloadAction<string>
        ) {

            state.tasks =
                state.tasks.filter(
                    (task) =>
                        task.id !== action.payload
                );

        },

    },
    

});

export const {

    setLoading,

    setTasks,

    addTask,

    updateTask,

    removeTask,

} = taskSlice.actions;

export default taskSlice.reducer;