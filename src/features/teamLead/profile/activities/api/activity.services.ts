import api from "@/src/lib/axios";

export const getEmployeeActivities = async (

    employeeId: string

) => {

    const response = await api.get(

        `/teamlead/team/${employeeId}/activities`

    );

    return response.data.data;

};

/**
 * Creates an activity assigned to `employeeId` inside `taskId`. The
 * task must already be assigned to that same employee (enforced
 * server-side in createActivityService).
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
 * Full edit — creator only. Backend 403s if the logged-in TL didn't
 * create this activity. Does NOT accept status/progress — those are
 * assignee-only via the status endpoint, not exposed here.
 */
export const updateEmployeeActivity = async (
    activityId: string,
    data: Record<string, any>
) => {
    const response = await api.put(`/activity/${activityId}`, data);
    return response.data.data;
};

/**
 * Deletes an activity. Backend enforces creator-only — 403 for
 * non-creators, matching the UI gating in ActivityCard.
 */
export const deleteEmployeeActivity = async (activityId: string) => {
    await api.delete(`/activity/${activityId}`);
};