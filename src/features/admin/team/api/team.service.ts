import api from "@/src/lib/axios";

export const getAllUsers = async (params?: { role?: string; search?: string }) => {
    const response = await api.get("/admin/team", { params });
    return response.data.data;
};