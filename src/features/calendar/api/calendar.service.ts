import api from "@/src/lib/axios";
import { CalendarEvent } from "../types";

export type CalendarType = "GOAL" | "TASK" | "ACTIVITY";

export interface CalendarQuery {
    start?: string;
    end?: string;
    date?: string;
    year?: number;
    month?: number;
    type?: CalendarType | string;
    priority?: string;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export interface RescheduleCalendarEvent {
    id: string;
    type: CalendarType;
    startDate: string;
    dueDate: string;
}

export const getCalendar = async (
    params?: Pick<CalendarQuery, "start" | "end">
) => {

    const response =
        await api.get("/calendar/events", {
            params,
        });

    return response.data.data;

};

export const getTodayAgenda = async () => {
    const response = await api.get("/calendar/today");
    return response.data.data;
};

export const getWeeklyAgenda = async (
    date = new Date().toISOString()
) => {
    const response = await api.get("/calendar/week", {
        params: {
            date,
        },
    });
    return response.data.data;
};

export const getMonthlyCalendar = async (
    params: Pick<CalendarQuery, "year" | "month" | "type" | "priority" | "status">
) => {
    const response = await api.get("/calendar/month", {
        params,
    });
    return response.data.data;
};

export const searchCalendar = async (
    params: Pick<CalendarQuery, "search" | "type" | "priority" | "status" | "startDate" | "endDate">
) => {
    const response = await api.get("/calendar/search", {
        params,
    });
    return response.data.data;
};

export const getCalendarAnalytics = async (
    params: Pick<CalendarQuery, "year" | "month">
) => {
    const response = await api.get("/calendar/analytics", {
        params,
    });
    return response.data.data;
};

export const rescheduleCalendarEvent = async (
    body: RescheduleCalendarEvent
) => {
    const response = await api.patch("/calendar/reschedule", body);
    return response.data.data;
};

/**
 * Generic "view someone else's calendar" — used by TL/Manager/HOD/Admin
 * to view a junior's schedule. Gated server-side by isSelfOrSubordinate.
 */
export const getUserCalendar = async (
    userId: string | number,
    params?: Pick<CalendarQuery, "start" | "end">
) => {
    const response = await api.get(`/calendar/${userId}/events`, { params });
    return response.data.data;
};

export const getUserTodayAgenda = async (userId: string | number) => {
    const response = await api.get(`/calendar/${userId}/today`);
    return response.data.data;
};

export const getUserWeeklyAgenda = async (
    userId: string | number,
    date = new Date().toISOString()
) => {
    const response = await api.get(`/calendar/${userId}/week`, {
        params: { date },
    });
    return response.data.data;
};