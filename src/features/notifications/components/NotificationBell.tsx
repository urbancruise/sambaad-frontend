"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/src/lib/store";
import { getNotifications } from "../api/notification.service";
import { setNotifications } from "../store/notificationSlice";
import { useNotifications } from "../hooks/useNotificaions";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {

    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);

    const { unread } = useNotifications();

    // Was only ever fetched when the dropdown opened (inside
    // NotificationDropdown's own effect) — meaning the badge count
    // stayed at 0 until the user clicked the bell once. Now fetches
    // as soon as the bell mounts, so the count is right immediately.
    useEffect(() => {
        const load = () => {
            getNotifications()
                .then((data) => dispatch(setNotifications(data)))
                .catch(() => {});
        };

        load();
        // Light polling so new notifications show up without needing a
        // manual refresh — 60s is a reasonable balance for a badge count.
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, [dispatch]);

    return (

        <div className="relative">

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="relative p-2 rounded-xl hover:bg-slate-100"
            >

                <Bell size={24} />

                {unread > 0 && (

                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">

                        {unread}

                    </span>

                )}

            </button>

            {open && (

                <NotificationDropdown
                    close={() =>
                        setOpen(false)
                    }
                />

            )}

        </div>

    );

}