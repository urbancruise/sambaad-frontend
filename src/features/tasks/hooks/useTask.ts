"use client";

import { useSelector } from "react-redux";

import { RootState } from "@/src/lib/store";

export const useTasks = () => {

    return useSelector(
        (state: RootState) => state.task
    );

};