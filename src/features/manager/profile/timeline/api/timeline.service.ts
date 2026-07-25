import api from "@/src/lib/axios";

export const getEmployeeTimeline = async (

    employeeId: string

) => {

    const response = await api.get(

        `/manager/team/${employeeId}/timeline`

    );

    return response.data.data;

};