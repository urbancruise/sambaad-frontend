export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
}

export interface NotificationResponse {
    notifications: Notification[];
}