"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/src/lib/store";
import { getUnreadCount } from "../api/email.service";
import { setUnreadCount } from "../store/Emailslice";

/**
 * Just the initial fetch + a Redux read now — the live socket
 * connection lives ONLY in GlobalEmailListener (mounted once at the
 * root layout). This used to also call useEmailSocket() itself,
 * meaning every visit to /email opened a second, redundant socket
 * connection on top of the global one.
 */
export const useEmailUnread = () => {
    const dispatch = useDispatch<AppDispatch>();
    const unreadCount = useSelector((state: RootState) => state.email.unreadCount);

    useEffect(() => {
        getUnreadCount()
            .then((count) => dispatch(setUnreadCount(count)))
            .catch(() => {});
    }, [dispatch]);

    return { unreadCount };
};