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

} from "../store/taskSlice";

import {

    getTasks

} from "../api/task.service";

export const useTasks = () => {

    const dispatch =
        useDispatch<AppDispatch>();

    const {

        tasks,

        loading

    } = useSelector(

        (state: RootState)=>

            state.teamLeadTasks

    );

    const refresh =
        useCallback(async()=>{

            dispatch(fetchStart());

            try{

                const data =
                    await getTasks();

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

        tasks,

        loading,

        refresh

    };

};