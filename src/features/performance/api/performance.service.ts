import api from "@/src/lib/axios";

export const getPerformanceDashboard = async () => {
    const response = await api.get(
        "/performance/dashboard"
    );

    return response.data.data;
};

export const getAchievements = async () => {
    const response = await api.get(
        "/performance/achievements"
    );

    return response.data.data;
};

export const getPerformanceAnalytics = async (
    period: "WEEKLY" | "MONTHLY" | "YEARLY" = "MONTHLY"
) => {
    const response = await api.get(
        "/performance/analytics",
        {
            params: {
                period,
            },
        }
    );

    return response.data.data;
};