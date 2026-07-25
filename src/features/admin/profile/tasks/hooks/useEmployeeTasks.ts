"use client";

import {

    useCallback,

    useEffect

} from "react";

import {

    useDispatch,

    useSelector

} from "react-redux";

import {

    useParams

} from "next/navigation";

import {

    AppDispatch,

    RootState

} from "@/src/lib/store";

import {

    getEmployeeTasks

} from "../api/task.service";

import {

    fetchTasksStart,

    fetchTasksSuccess,

    fetchTasksFailure

} from "../store/taskSlice";

export const useEmployeeTasks = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const {

        employeeId

    } = useParams<{

        employeeId: string;

    }>();

    const {

        tasks,

        loading,

        error

    } = useSelector(

        (state: RootState) =>

            state.managerTeamLeadTasks

    );

    const refreshTasks =
        useCallback(async () => {

            if (!employeeId) return;

            dispatch(

                fetchTasksStart()

            );

            try {

                const data =
                    await getEmployeeTasks(

                        employeeId

                    );

                dispatch(

                    fetchTasksSuccess(

                        data

                    )

                );

            } catch {

                dispatch(

                    fetchTasksFailure(

                        "Unable to load tasks."

                    )

                );

            }

        }, [

            dispatch,

            employeeId

        ]);

    useEffect(() => {

        refreshTasks();

    }, [

        refreshTasks

    ]);

    return {

        tasks,

        loading,

        error,

        refreshTasks

    };

};