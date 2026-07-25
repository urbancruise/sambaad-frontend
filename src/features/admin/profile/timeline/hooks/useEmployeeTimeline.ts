"use client";

import {

    useCallback,

    useEffect

} from "react";

import {

    useParams

} from "next/navigation";

import {

    useDispatch,

    useSelector

} from "react-redux";

import {

    AppDispatch,

    RootState

} from "@/src/lib/store";

import {

    getEmployeeTimeline

} from "../api/timeline.service";

import {

    fetchTimelineFailure,

    fetchTimelineStart,

    fetchTimelineSuccess

} from "../store/timelineSlice";

export const useEmployeeTimeline = () => {

    const dispatch =

        useDispatch<AppDispatch>();

    const {

        employeeId

    } = useParams<{

        employeeId: string;

    }>();

    const {

        timeline,

        loading,

        error

    } = useSelector(

        (state: RootState) =>

            state.employeeTimeline

    );

    const refreshTimeline =

        useCallback(async () => {

            if (!employeeId) return;

            dispatch(

                fetchTimelineStart()

            );

            try {

                const data =

                    await getEmployeeTimeline(

                        employeeId

                    );

                dispatch(

                    fetchTimelineSuccess(

                        data

                    )

                );

            } catch {

                dispatch(

                    fetchTimelineFailure(

                        "Unable to fetch timeline."

                    )

                );

            }

        }, [

            dispatch,

            employeeId

        ]);

    useEffect(() => {

        refreshTimeline();

    }, [

        refreshTimeline

    ]);

    return {

        timeline,

        loading,

        error,

        refreshTimeline

    };

};