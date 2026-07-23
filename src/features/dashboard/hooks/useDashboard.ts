import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export const useDashboard = () => {
    return useSelector(
        (state: RootState) => state.dashboard
    );
};