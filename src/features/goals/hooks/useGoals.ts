import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export const useGoals = () =>
    useSelector(
        (state: RootState) => state.goals
    );