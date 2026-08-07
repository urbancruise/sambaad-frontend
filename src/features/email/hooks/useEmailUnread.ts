"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/src/lib/store";
import { getUnreadCount } from "../api/email.service";
import { setUnreadCount } from "../store/Emailslice";
import { useEmailSocket } from "./useEmailSocket";

export const useEmailUnread = () => {
    const dispatch = useDispatch<AppDispatch>();
    const unreadCount = useSelector((state: RootState) => state.email.unreadCount);
    const { latestEmail, clearLatestEmail } = useEmailSocket();

    useEffect(() => {
        getUnreadCount()
            .then((count) => dispatch(setUnreadCount(count)))
            .catch(() => {});
    }, [dispatch]);

    return { unreadCount, latestEmail, clearLatestEmail };
};