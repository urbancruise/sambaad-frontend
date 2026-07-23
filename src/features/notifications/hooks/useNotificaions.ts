import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export const useNotifications = () => {

    const notifications =
        useSelector(
            (state: RootState) =>
            state.notification.notifications
        );

    const unread =
        notifications.filter(
            (n) => !n.isRead
        ).length;

    return {
        notifications,
        unread,
    };

};
