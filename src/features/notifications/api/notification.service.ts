import api from "@/src/lib/axios";

export const getNotifications = async () => {
    const res = await api.get("/notifications");

    return res.data.data.notifications;
};

export const markNotificationRead = async (
    id: string
) => {
    return api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead =
    async () => {
        return api.put(
            "/notifications/read-all"
        );
    };
