'use client'
import api from "@/src/lib/axios";
import { Task } from "../types";
import { TaskFormValues } from "../schema/task.schema";


export const getTasks = async (
    params?: Record<string, unknown>
) => {

    const response = await api.get(
        "/tasks",
        {
            params,
        }
    );
    return response.data.data;

};


export const getTaskById = async (
    taskId: string
) => {

    const response = await api.get(
        `/tasks/${taskId}`
    );

    return response.data.data;

};

export const createTask = async (
    body: TaskFormValues
): Promise<Task> => {

    const response = await api.post(
        "/tasks",
        body
    );

    return response.data.data;

};

/**
 * FULL EDIT — creator only. Title, dates, priority, reassignment.
 * Will 403 if called by anyone other than the task's creator.
 * Do NOT use this to change status — see updateTaskStatus below.
 */
export const updateTask = async (
    taskId: string,
    body: Partial<TaskFormValues>
):Promise<Task> => {
       const response = await api.put(`/tasks/${taskId}`, body);
    return response.data.data;
};

/**
 * STATUS UPDATE — assignee only. Use this for tasks that carry a
 * direct status (e.g. standalone tasks without activities under them).
 */
export const updateTaskStatus = async (
    taskId: string,
    body: { status: string; progress?: number }
): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/status`, body);
    return response.data.data;
};

export const deleteTask = async (
    taskId: string
) => {

    const response = await api.delete(
        `/tasks/${taskId}`
    );

    return response.data.data;

};