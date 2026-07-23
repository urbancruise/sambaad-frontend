import api from "@/src/lib/axios";

export const getGoals = async () => {

    const response = await api.get(

        "/teamlead/goals"

    );

    return response.data.data;

};

export const createGoal = async (

    data: any

) => {

    const response = await api.post(

        "/teamlead/goals",

        data

    );

    return response.data.data;

};

export const updateGoal = async (

    id: string,

    data: any

) => {

    const response = await api.patch(

        `/teamlead/goals/${id}`,

        data

    );

    return response.data.data;

};

export const deleteGoal = async (

    id: string

) => {

    await api.delete(

        `/teamlead/goals/${id}`

    );

};