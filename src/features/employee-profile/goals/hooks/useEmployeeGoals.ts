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

import type {

    AppDispatch,

    RootState

} from "@/src/lib/store";

import {

    getEmployeeGoals

} from "../api/goal.service";

import { useProfileRole } from "../../context/ProfileRoleContext";

import {

    fetchGoalsStart,

    fetchGoalsSuccess,

    fetchGoalsFailure

} from "../store/goalSlice";

export const useEmployeeGoals = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const { basePath } = useProfileRole();

    const { employeeId } =
        useParams<{

            employeeId: string;

        }>();

    const {

        goals,

        loading,

        error

    } = useSelector(

        (state: RootState) =>

            state.sharedEmployeeGoals

    );

const refreshGoals = useCallback(async () => {

    if (!employeeId) return;

    dispatch(fetchGoalsStart());

    try {

        const response = await getEmployeeGoals(basePath, employeeId);

        dispatch(
            fetchGoalsSuccess(
                response.goals ?? response
            )
        );

    } catch {

        dispatch(
            fetchGoalsFailure(
                "Unable to load employee goals."
            )
        );

    }

}, [dispatch, basePath, employeeId]);

    useEffect(() => {

        refreshGoals();

    }, [

        refreshGoals

    ]);

    return {

        goals,

        loading,

        error,

        refreshGoals

    };

};