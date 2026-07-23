import api from "@/src/lib/axios";
import {
 Activity,
 ActivityResponse
} from "../types";


export const getActivities = async (
 params?: Record<string, unknown>
):Promise<ActivityResponse> => {

 const {data}=await api.get(
    "/activity",
    {params}
 );

 return data.data;

};



export const getActivityById =
async(id:string):Promise<Activity>=>{

 const {data}=await api.get(
    `/activity/${id}`
 );

 return data.data;

};



export const createActivity =
async(payload:Partial<Activity>)=>{

 const {data}=await api.post(
    "/activity",
    payload
 );

 return data.data;

};


/**
 * FULL EDIT — creator only. Title, dates, priority, reassignment.
 * Will 403 if called by anyone other than the activity's creator.
 * Do NOT use this to change status — see updateActivityStatus below.
 */
export const updateActivity =
async(
 id:string,
 payload:Partial<Activity>
)=>{

 const {data}=await api.put(
    `/activity/${id}/status`,
    payload
 );

 return data.data;

};


/**
 * STATUS UPDATE — assignee only. This is the "tick as done" flow.
 * Cascades progress up to the parent Task and Goal automatically.
 */
export const updateActivityStatus = async (
  id: string,
  payload: { status: string; progress?: number }
) => {

  const { data } = await api.patch(
    `/activity/${id}/status`,
    payload
  );

  return data.data;

};



export const deleteActivity =
async(id:string)=>{

 await api.delete(
    `/activity/${id}`
 );

 return true;

};



export const completeActivity =
async(id:string)=>{

 return updateActivityStatus(
    id,
    {
      status:"COMPLETED"
    }
 );

};