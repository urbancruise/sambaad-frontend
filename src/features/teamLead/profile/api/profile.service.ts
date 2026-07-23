import api from "@/src/lib/axios";

export const getEmployeeProfile = async (

    employeeId: string

) => {

    const response = await api.get(

        `/teamlead/team/${employeeId}`

    );

    return response.data.data;

};