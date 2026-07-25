import api from "@/src/lib/axios";

export const getEmployeeGoals = async (

    employeeId: string

) => {

    const response = await api.get(

        `/manager/team/${employeeId}/goals`

    );

    return response.data.data;

};

/**
 * Creates a goal assigned to the TL (`employeeId`). Reuses the shared
 * /goals endpoint — createdById resolves from the logged-in Manager,
 * and canAssignToUser permits assigning to anyone in their subordinate
 * chain (TLs, and transitively TL's employees).
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
 * Full edit — creator only. Backend 403s if the logged-in Manager
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