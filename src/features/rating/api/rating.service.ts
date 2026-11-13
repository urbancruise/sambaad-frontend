import api from "@/src/lib/axios";
import { FieldPoolInput, FieldSetupInput, RatingSubmission } from "../types";

export const getDepartments = async () => {
    const response = await api.get("/rating/departments");
    return response.data.data;
};

export const getFilterOptions = async (departmentId?: string, subDepartmentId?: string) => {
    const response = await api.get("/rating/filters", {
        params: { departmentId: departmentId || undefined, subDepartmentId: subDepartmentId || undefined },
    });
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

export const getTeamRating = async (params?: {
    department?: string;
    subDepartment?: string;
    period?: string;
}) => {
    const response = await api.get("/rating/team", { params });
    return response.data.data;
};

// One card per person per month. All params optional.
export const getRatingHistory = async (params?: {
    department?: string;
    subDepartment?: string;
    employeeId?: string;
    month?: string;
    year?: string;
}) => {
    const response = await api.get("/rating/history", { params });
    return response.data.data;
};

export const submitSelfRating = async (employeeId: number | string, data: RatingSubmission) => {
    const response = await api.put(`/rating/${employeeId}/self`, data);
    return response.data.data;
};

// L-1
export const submitSeniorRating = async (employeeId: number | string, data: RatingSubmission) => {
    const response = await api.put(`/rating/${employeeId}/senior`, data);
    return response.data.data;
};

// L-2
export const submitSuperSeniorRating = async (employeeId: number | string, data: RatingSubmission) => {
    const response = await api.put(`/rating/${employeeId}/super-senior`, data);
    return response.data.data;
};

/* ---- Per-user "Customize fields": tick fields from the central list ---- */

export const getFieldSetup = async (employeeId: number | string, period: string) => {
    const response = await api.get(`/rating/${employeeId}/fields`, { params: { period } });
    return response.data.data;
};

export const saveFieldSetup = async (employeeId: number | string, data: FieldSetupInput) => {
    const response = await api.put(`/rating/${employeeId}/fields`, data);
    return response.data.data;
};

/* ---- "Manage fields": the central list of a sub-department ---- */

export const getFieldPools = async () => {
    const response = await api.get("/rating/field-pools");
    return response.data.data;
};

export const getFieldPool = async (subDepartmentId: number | string, period: string) => {
    const response = await api.get(`/rating/field-pools/${subDepartmentId}`, { params: { period } });
    return response.data.data;
};

export const saveFieldPool = async (subDepartmentId: number | string, data: FieldPoolInput) => {
    const response = await api.put(`/rating/field-pools/${subDepartmentId}`, data);
    return response.data.data;
};
