import { useSelector } from "react-redux";

import { RootState } from "@/src/lib/store";

export const useCalendar = () => {

    return useSelector(

        (state: RootState) =>

            state.calendar

    );

};