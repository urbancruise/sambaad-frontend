import api from "@/src/lib/axios";

export const getEmployeeActivities = async (

    employeeId: string

) => {

    const response = await api.get(

        `/manager/team/${employeeId}/activities`

    );

    return response.data.data;

};

/**
 * Creates an activity assigned to the TL (`employeeId`) inside
 * `taskId`. The task must already be assigned to that same TL
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
 * Full edit — creator only. Backend 403s if the logged-in Manager
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