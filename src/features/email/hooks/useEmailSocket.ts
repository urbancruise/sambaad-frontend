"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client"; // npm install socket.io-client

import { AppDispatch, RootState } from "@/src/lib/store";
import { getAccessToken } from "@/src/lib/auth";
import { incrementUnread } from "../store/Emailslice";

interface NewEmailEvent {
    emailId: string;
    subject: string;
    threadId: string;
}

/**
 * Connects once (call this from a top-level layout, same spirit as
 * AuthInitializer) and keeps the unread badge live without polling.
 * Also exposes the latest "new email" event so a toast/banner can be
 * rendered wherever this hook is used.
 */
export const useEmailSocket = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const socketRef = useRef<Socket | null>(null);
    const [latestEmail, setLatestEmail] = useState<NewEmailEvent | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const token = getAccessToken();
        if (!token) return;

        const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000", {
            auth: { token },
            withCredentials: true,
        });

        socket.on("email:new", (payload: NewEmailEvent) => {
            dispatch(incrementUnread());
            setLatestEmail(payload);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, dispatch]);

    return { latestEmail, clearLatestEmail: () => setLatestEmail(null) };
};