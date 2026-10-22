import api from "@/src/lib/axios";

const BASE = "/teamlead/dashboard";

export const getTeamLeadDashboard = async (teamLeadId?: number | string) => {
  const url = teamLeadId ? `${BASE}/${teamLeadId}` : BASE;
  const res = await api.get(url);
  return res.data.data;
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