"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import { useNotifications } from "../hooks/useNotificaions";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {

    const [open, setOpen] =
        useState(false);

    const { unread } =
        useNotifications();

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