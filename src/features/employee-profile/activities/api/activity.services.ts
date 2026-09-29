import api from "@/src/lib/axios";

export const getEmployeeActivities = async (
    basePath: string,
    employeeId: string
) => {
    const response = await api.get(`${basePath}/${employeeId}/activities`);
    return response.data.data;
};

/**
 * Creates an activity assigned to the employee (`employeeId`) inside
 * `taskId`. The task must already be assigned to that same employee
 * (enforced server-side in createActivityService).
 */
export const createEmployeeActivity = async (
    employeeId: string,
    data: Record<string, any>
) => {

    const response = await api.post("/activity", {
        ...data,
        assignedToId: Number(employeeId),
    });

    return response.data.data;

};

/**
 * Full edit — creator only. Backend 403s if the logged-in user
 * didn't create this activity. Does NOT accept status/progress.
 */
export const updateEmployeeActivity = async (
    activityId: string,
    data: Record<string, any>
) => {
    const response = await api.put(`/activity/${activityId}`, data);
    return response.data.data;
};

/**
 * Deletes an activity. Backend enforces creator-only.
 */
export const deleteEmployeeActivity = async (activityId: string) => {
    await api.delete(`/activity/${activityId}`);
};

