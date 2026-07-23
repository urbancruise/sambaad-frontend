import { useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/lib/store";

import { getTeamMembers } from "../api/team.service";

import {

    fetchTeamStart,

    fetchTeamSuccess,

    fetchTeamFailure

} from "../store/teamSlice";

export const useTeam = () => {

    const dispatch = useDispatch<AppDispatch>();

    const {

        members,

        loading,

        error

    } = useSelector(

        (state: RootState) => state.team

    );

    const refreshTeam = useCallback(

        async () => {

            dispatch(fetchTeamStart());

            try {

                const data =
                    await getTeamMembers();

                dispatch(

                    fetchTeamSuccess(data)

                );

            } catch {

                dispatch(

                    fetchTeamFailure(

                        "Unable to load team."

                    )

                );

            }

        },

        [dispatch]

    );

    useEffect(() => {

        refreshTeam();

    }, [refreshTeam]);

    return {

        members,

        loading,

        error,

        refreshTeam

    };

};