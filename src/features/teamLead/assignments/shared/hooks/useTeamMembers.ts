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

    AppDispatch,

    RootState

} from "@/src/lib/store";

import {

    getTeamMembers

} from "../api/employee.service";

import {

    fetchFailure,

    fetchStart,

    fetchSuccess

} from "../store/teamSlice";

export const useTeamMembers = () => {

    const dispatch =

        useDispatch<AppDispatch>();

    const {

        members,

        loading

    } = useSelector(

        (state: RootState)=>

            state.teamMembers

    );

    const refresh =

        useCallback(async()=>{

            dispatch(fetchStart());

            try{

                const data =

                    await getTeamMembers();

                dispatch(

                    fetchSuccess(data)

                );

            }

            catch{

                dispatch(

                    fetchFailure()

                );

            }

        },[dispatch]);

    useEffect(()=>{

        refresh();

    },[refresh]);

    return{

        members,

        loading

    };

};