import api from "@/src/lib/axios";

export const getTodayWork = async () => {

    const response =
        await api.get("/goals/today");
    return response.data.data;

};