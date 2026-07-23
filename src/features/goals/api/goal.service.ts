import api from "@/src/lib/axios";
import { Goal } from "../types/index";
import {GoalFormValues } from "../schema/goal.schema";

export const getGoals = async (params?: Record<string, any>) => {
    const response = await api.get("/goals", { params });
    return response.data.data;
};

export const getGoalById = async (goalId: string): Promise<Goal> => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data.data;
};

export const createGoal = async (
    body: GoalFormValues
): Promise<Goal> => {
    const response = await api.post("/goals", body);
    return response.data.data;
};

export const updateGoal = async (
    goalId: string,
    body: Partial<GoalFormValues>
): Promise<Goal> => {
    const response = await api.put(`/goals/${goalId}`, body);
    return response.data.data;
};

export const deleteGoal = async (goalId: string) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data.data;
};