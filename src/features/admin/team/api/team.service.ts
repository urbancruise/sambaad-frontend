import api from "@/src/lib/axios";
import type { Department, PaginatedUsers, TeamQuery } from "../types";

export const getAllUsers = async (params: TeamQuery): Promise<PaginatedUsers> => {
    const response = await api.get("/admin/team", { params });
    return response.data.data;
};

export const getDepartments = async (): Promise<Department[]> => {
    const response = await api.get("/admin/team/departments");
    return response.data.data;
};