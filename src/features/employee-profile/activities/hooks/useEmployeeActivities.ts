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

    getEmployeeActivities

} from "../api/activity.services";

import { useProfileRole } from "../../context/ProfileRoleContext";

import {

    fetchActivitiesStart,

    fetchActivitiesSuccess,

    fetchActivitiesFailure

} from "../store/activitySlice";

export const useEmployeeActivities = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const { basePath } = useProfileRole();

    const {

        employeeId

    } = useParams<{

        employeeId: string;

    }>();

    const {

        activities,

        loading,

        error

    } = useSelector(

        (state: RootState) =>

            state.sharedEmployeeActivities

    );

    const refreshActivities =
        useCallback(async () => {

            if (!employeeId) return;

            dispatch(

                fetchActivitiesStart()

            );

            try {

                const data =
                    await getEmployeeActivities(basePath, employeeId);

                dispatch(

                    fetchActivitiesSuccess(

                        data

                    )

                );

            } catch {

                dispatch(

                    fetchActivitiesFailure(

                        "Unable to load activities."

                    )

                );

            }

        }, [dispatch, basePath, employeeId]);

    useEffect(() => {

        refreshActivities();

    }, [

        refreshActivities

    ]);

    return {

        activities,

        loading,

        error,

        refreshActivities

    };

};