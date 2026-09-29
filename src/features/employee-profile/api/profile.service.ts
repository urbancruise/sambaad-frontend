import api from "@/src/lib/axios";

export const getEmployeeProfile = async (
    basePath: string,
    employeeId: string
) => {
    const response = await api.get(`${basePath}/${employeeId}`);
    return response.data.data;
};