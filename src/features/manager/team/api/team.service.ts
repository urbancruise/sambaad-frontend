import api from "@/src/lib/axios";

export const getMyTeamLeads = async () => {
    const response = await api.get("/manager/team");
    return response.data.data;
};