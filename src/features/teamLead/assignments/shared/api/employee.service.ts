import api from "@/src/lib/axios";

export const getTeamMembers = async () => {

    const response = await api.get(

        "/teamlead/team"

    );

    return response.data.data;

};