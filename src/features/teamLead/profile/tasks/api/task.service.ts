import api from "@/src/lib/axios";

export const getEmployeeTasks = async (

    employeeId: string

) => {

    const response = await api.get(

        `/teamlead/team/${employeeId}/tasks`

    );

    return response.data.data;

};

/**
 * Creates a task assigned to `employeeId` inside `goalId`. The goal
 * must already be assigned to that same employee (enforced server-side
 * in createTaskService).
 */
export const createEmployeeTask = async (
    employeeId: string,
    data: Record<string, any>
) => {

    const response = await api.post("/tasks", {
        ...data,
        assignedToId: Number(employeeId),
    });

    return response.data.data;

};

/**
 * Full edit — creator only. Backend 403s if the logged-in TL didn't
 * create this task.
 */
export const updateEmployeeTask = async (
    taskId: string,
    data: Record<string, any>
) => {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data.data;
};

/**
 * Deletes a task. Backend enforces creator-only — 403 for non-creators,
 * matching the UI gating in TaskCard.
 */
export const deleteEmployeeTask = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
};