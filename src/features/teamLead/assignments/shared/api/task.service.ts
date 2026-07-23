import api from "@/src/lib/axios";

export const getSelectableTasks = async (

    goalId: string

) => {

    const response = await api.get(

        "/teamlead/tasks/select",

        {

            params: {

                goalId

            }

        }

    );

    return response.data.data;

};