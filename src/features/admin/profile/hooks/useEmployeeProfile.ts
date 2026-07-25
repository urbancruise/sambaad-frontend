import { useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "next/navigation";

import type {
    AppDispatch,
    RootState
} from "@/src/lib/store";

import { getEmployeeProfile } from "../api/profile.service";

import {

    fetchProfileStart,

    fetchProfileSuccess,

    fetchProfileFailure

} from "../store/profileSlice";

export const useEmployeeProfile = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const { employeeId } =
        useParams<{
            employeeId: string;
        }>();

    const {

        profile,

        loading,

        error

    } = useSelector(

        (state: RootState) =>

            state.managerTeamLeadProfile

    );

    const refreshProfile =
        useCallback(async () => {

            if (!employeeId) return;

            dispatch(
                fetchProfileStart()
            );

            try {

                const data =
                    await getEmployeeProfile(
                        employeeId
                    );

                dispatch(
                    fetchProfileSuccess(
                        data
                    )
                );

            } catch {

                dispatch(
                    fetchProfileFailure(
                        "Unable to load employee profile."
                    )
                );

            }

        }, [

            dispatch,

            employeeId

        ]);

    useEffect(() => {

        refreshProfile();

    }, [

        refreshProfile

    ]);

    return {

        profile,

        loading,

        error,

        refreshProfile

    };

};