import api from "@/src/lib/axios";

export const getTasks = async () => {

    const response = await api.get(

        "/teamlead/tasks"

    );

    return response.data.data;

};

export const createTask = async (

    data: any

) => {

    const response = await api.post(

        "/teamlead/tasks",

        data

    );

    return response.data.data;

};

export const updateTask = async (

    id: string,

    data: any

) => {

    const response = await api.patch(

        `/teamlead/tasks/${id}`,

        data

    );

    return response.data.data;

};

export const deleteTask = async (

    id: string

) => {

    await api.delete(

        `/teamlead/tasks/${id}`

    );

};