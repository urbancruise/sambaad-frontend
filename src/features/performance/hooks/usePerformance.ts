import { useSelector } from "react-redux";

import { RootState } from "@/src/lib/store";

export const usePerformance = () => {

    return useSelector(

        (state: RootState) =>

            state.performance

    );

};