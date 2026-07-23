"use client";

import { useSelector } from "react-redux";

import { RootState } from "@/src/lib/store";

export const useActivities = () => {

    return useSelector(
        (state: RootState) => state.activities
    );

};