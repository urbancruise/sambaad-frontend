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

    fetchFailure,

    fetchStart,

    fetchSuccess

} from "../store/goalSlice";

import {

    getGoals

} from "../api/goal.service";

export const useGoals = () => {

    const dispatch =

        useDispatch<AppDispatch>();

    const {

        goals,

        loading

    } = useSelector(

        (state: RootState)=>

            state.teamLeadGoals

    );

    const refresh =

        useCallback(async()=>{

            dispatch(fetchStart());

            try{

                const data =

                    await getGoals();

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

        goals,

        loading,

        refresh

    };

};