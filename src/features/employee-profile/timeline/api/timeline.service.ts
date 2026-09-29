import api from "@/src/lib/axios";

export const getEmployeeTimeline = async (
    basePath: string,
    employeeId: string
) => {
    const response = await api.get(`${basePath}/${employeeId}/timeline`);
    return response.data.data;
};