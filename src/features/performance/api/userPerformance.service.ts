import api from "@/src/lib/axios";

export const getUserPerformanceDashboard = async (userId: string) => {
    const response = await api.get(`/performance/${userId}/dashboard`);
    return response.data.data;
};

export const getUserAchievements = async (userId: string) => {
    const response = await api.get(`/performance/${userId}/achievements`);
    return response.data.data;
};

export const getUserPerformanceAnalytics = async (
    userId: string,
    period: "WEEKLY" | "MONTHLY" | "YEARLY" = "MONTHLY"
) => {
    const response = await api.get(`/performance/${userId}/analytics`, {
        params: { period },
    });
    return response.data.data;
};