import api from "@/src/lib/axios";

export const getEmployeeGoals = async (
    basePath: string,
    employeeId: string
) => {
    const response = await api.get(`${basePath}/${employeeId}/goals`);
    return response.data.data;
};

/**
 * Creates a goal assigned to the employee (`employeeId`). Reuses the shared
 * /goals endpoint — createdById resolves from the logged-in user,
 * and canAssignToUser permits assigning to anyone in their subordinate
 * chain (and transitively their reports).
 */
export const createEmployeeGoal = async (
    employeeId: string,
    data: Record<string, any>
) => {

    const response = await api.post("/goals", {
        ...data,
        assignedToId: Number(employeeId),
    });

    return response.data.data;

};

/**
 * Full edit — creator only. Backend 403s if the logged-in user
 * didn't create this goal.
 */
export const updateEmployeeGoal = async (
    goalId: string,
    data: Record<string, any>
) => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data.data;
};

/**
 * Deletes a goal. Backend enforces creator-only via canModifyResource.
 */
export const deleteEmployeeGoal = async (goalId: string) => {
    await api.delete(`/goals/${goalId}`);
};