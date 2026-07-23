"use client";

import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

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

    const read = async (
        id: string
    ) => {

        await markNotificationRead(id);

        dispatch(
            markRead(id)
        );

        close();

    };

    const readAll = async () => {

        await markAllNotificationsRead();

        dispatch(markAll());

    };

    return (

        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl border shadow-xl z-50">

            <div className="flex justify-between items-center p-4 border-b">

                <h2 className="font-bold">

                    Notifications

                </h2>

                <button
                    onClick={readAll}
                    className="text-emerald-600 text-sm"
                >

                    Mark all

                </button>

            </div>

            <div className="max-h-96 overflow-y-auto">

                {notifications.length === 0 && (

                    <div className="p-8 text-center text-slate-500">

                        No notifications

                    </div>

                )}

                {notifications.map((item: Notification) => (

                    <div
                        key={item.id}
                        onClick={() =>
                            read(item.id)
                        }
                        className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${
                            !item.isRead
                                ? "bg-blue-50"
                                : ""
                        }`}
                    >

                        <h3 className="font-semibold">

                            {item.title}

                        </h3>

                        <p className="text-sm text-slate-500 mt-1">

                            {item.message}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}
