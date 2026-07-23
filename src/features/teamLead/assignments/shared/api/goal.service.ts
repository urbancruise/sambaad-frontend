import api from "@/src/lib/axios";

export const getSelectableGoals = async () => {

    const response = await api.get(

        "/teamlead/goals/select"

    );

    return response.data.data;

};