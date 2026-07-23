import api from "@/src/lib/axios";

export const getEmployeeTimeline = async (

    employeeId: string

) => {

    const response = await api.get(

        `/teamlead/team/${employeeId}/timeline`

    );

    return response.data.data;

};