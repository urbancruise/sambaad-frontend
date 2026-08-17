export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    link?: string | null;
    createdAt: string;
}

export interface NotificationResponse {
    notifications: Notification[];
}