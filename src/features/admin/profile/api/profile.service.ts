import api from "@/src/lib/axios";

export const getEmployeeProfile = async (

    employeeId: string

) => {

    const response = await api.get(

        `/admin/team/${employeeId}`

    );
    console.log(response)

    return response.data.data;

};