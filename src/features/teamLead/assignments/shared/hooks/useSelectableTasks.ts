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

    getSelectableTasks

} from "../api/task.service";

import {

    fetchFailure,

    fetchStart,

    fetchSuccess,

    clear

} from "../store/selectableTaskSlice";

export const useSelectableTasks = (

    goalId?: string

) => {

    const dispatch =

        useDispatch<AppDispatch>();

    const {

        tasks,

        loading

    } = useSelector(

        (state: RootState)=>

            state.selectableTasks

    );

    const refresh =

        useCallback(async()=>{

            if(!goalId){

                dispatch(clear());

                return;

            }

            dispatch(fetchStart());

            try{

                const data =

                    await getSelectableTasks(

                        goalId

                    );

                dispatch(

                    fetchSuccess(data)

                );

            }

            catch{

                dispatch(

                    fetchFailure()

                );

            }

        },[dispatch,goalId]);

    useEffect(()=>{

        refresh();

    },[refresh]);

    return{

        tasks,

        loading

    };

};