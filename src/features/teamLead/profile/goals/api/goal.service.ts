import api from "@/src/lib/axios";

export const getEmployeeGoals = async (

    employeeId: string

) => {

    const response = await api.get(

        `/teamlead/team/${employeeId}/goals`

    );

    return response.data.data;

};


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


export const updateEmployeeGoal = async (
    goalId: string,
    data: Record<string, any>
) => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data.data;
};


export const deleteEmployeeGoal = async (goalId: string) => {
    await api.delete(`/goals/${goalId}`);
};