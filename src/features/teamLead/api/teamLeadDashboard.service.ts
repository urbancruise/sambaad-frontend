import api from "@/src/lib/axios";


export const getTeamLeadDashboard = async()=>{

    const response =
        await api.get(
            "/teamlead/dashboard"
        );

    return response.data.data;

};

export const getMyTeam = async () => {

    const response =
        await api.get("/team/team-members");

    return response.data.data;

};

export const createGoal = async (data:any)=>{

    const response =
        await api.post("/goals",data);

    return response.data.data;

};

export const createTask = async(data:any)=>{

    const response =
        await api.post("/tasks",data);

    return response.data.data;

};

export const createActivity = async(data:any)=>{

    const response =
        await api.post("/activity",data);

    return response.data.data;

};