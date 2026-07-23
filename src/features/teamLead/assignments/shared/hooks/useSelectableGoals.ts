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

    getSelectableGoals

} from "../api/goal.service";

import {

    fetchFailure,

    fetchStart,

    fetchSuccess

} from "../store/selectableGoalSlice";

export const useSelectableGoals = () => {

    const dispatch =

        useDispatch<AppDispatch>();

    const {

        goals,

        loading

    } = useSelector(

        (state: RootState) =>

            state.selectableGoals

    );

    const refresh = useCallback(async()=>{

        dispatch(fetchStart());

        try{

            const data =

                await getSelectableGoals();

            dispatch(fetchSuccess(data));

        }

        catch{

            dispatch(fetchFailure());

        }

    },[dispatch]);

    useEffect(()=>{

        refresh();

    },[refresh]);

    return{

        goals,

        loading

    };

};