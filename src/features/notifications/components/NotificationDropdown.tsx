"use client";

import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../api/notification.service";

import {
    setNotifications,
    markRead,
    markAll,
} from "../store/notificationSlice";

import { useNotifications } from "../hooks/useNotificaions";
import { Notification } from "../types";

export default function NotificationDropdown({
    close,
}: {
    close: () => void;
}) {

    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const {
        notifications,
    } = useNotifications();

    const load = useCallback(async () => {

        const data =
            await getNotifications();

        dispatch(
            setNotifications(data)
        );

    }, [dispatch]);

    useEffect(() => {

        load();

    }, [load]);

    const handleClick = async (item: Notification) => {
        await markNotificationRead(item.id);
        dispatch(markRead(item.id));

        // link is stored role-agnostic (e.g. "/email/thread/abc123") —
        // prefix with whichever role section the user is currently in,
        // same pattern used for Calendar/Task links elsewhere in the app.
        if (item.link) {
            const basePath = `/${pathname?.split("/")[1] || "employee"}`;
            router.push(`${basePath}${item.link}`);
        }

        close();
    };

    const readAll = async () => {

        await markAllNotificationsRead();

        dispatch(markAll());

    };

    return (

        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50">

            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">

                <h2 className="font-bold text-slate-800 dark:text-white">

                    Notifications

                </h2>

                <button
                    onClick={readAll}
                    className="text-emerald-600 dark:text-emerald-400 text-sm"
                >

                    Mark all

                </button>

            </div>

            <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 && (

                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">

                        No notifications

                    </div>

                )}

                {notifications.map((item: Notification) => (

                    <div
                        key={item.id}
                        onClick={() => handleClick(item)}
                        className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                            !item.isRead
                                ? "bg-blue-50 dark:bg-blue-500/10"
                                : ""
                        }`}
                    >

                        <h3 className="font-semibold text-slate-800 dark:text-white">

                            {item.title}

                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">

                            {item.message}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}