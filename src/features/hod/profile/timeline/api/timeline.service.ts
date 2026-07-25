import api from "@/src/lib/axios";

export const getEmployeeTimeline = async (

    employeeId: string

) => {

    const response = await api.get(

        `/hod/team/${employeeId}/timeline`

    );

    return response.data.data;

};