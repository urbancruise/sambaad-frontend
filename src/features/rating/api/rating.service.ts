import api from "@/src/lib/axios";
import { RatingSubmission } from "../types";

export const getDepartments = async () => {
    const response = await api.get("/rating/departments");
    return response.data.data;
};

export const getFieldConfig = async (departmentId: number | string) => {
    const response = await api.get("/rating/field-config", { params: { departmentId } });
    return response.data.data;
};

export const getMyRating = async (period?: string) => {
    const response = await api.get("/rating/me", { params: { period } });
    return response.data.data;
};

export const getEmployeeRating = async (employeeId: number | string, period?: string) => {
    const response = await api.get(`/rating/${employeeId}`, { params: { period } });
    return response.data.data;
};

export const getTeamRating = async (params?: { department?: string; period?: string }) => {
    const response = await api.get("/rating/team", { params });
    return response.data.data;
};

export const submitSelfRating = async (employeeId: number | string, data: RatingSubmission) => {
    const response = await api.put(`/rating/${employeeId}/self`, data);
    return response.data.data;
};

export const submitSeniorRating = async (employeeId: number | string, data: RatingSubmission) => {
    const response = await api.put(`/rating/${employeeId}/senior`, data);
    return response.data.data;
};