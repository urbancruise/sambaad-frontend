import api from "@/src/lib/axios";

export const getMyTeamLeads = async () => {
    const response = await api.get("/hod/team");
    return response.data.data;
};