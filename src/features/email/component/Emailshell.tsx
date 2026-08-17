"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import EmailSidebar from "./EmailSidebar";
import ComposeModal from "./Composemodal";
import { useEmailUnread } from "../hooks/useEmailUnread";
import { getLabels } from "../api/email.service";
import { Label } from "../types";

export default function EmailShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const basePath = `/${pathname?.split("/")[1] || "employee"}/email`;

    // Live socket connection + toast now live in GlobalEmailListener,
    // mounted once at the root layout — this just reads the count.
    const { unreadCount } = useEmailUnread();
    const [labels, setLabels] = useState<Label[]>([]);
    const [composeOpen, setComposeOpen] = useState(false);

    useEffect(() => {
        getLabels().then(setLabels).catch(() => setLabels([]));
    }, []);

    const handleSent = () => {
        router.push(`${basePath}/inbox`);
    };

    return (
        <div className="flex h-full min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950">
            <EmailSidebar unreadCount={unreadCount} labels={labels} onCompose={() => setComposeOpen(true)} />

            <div className="flex-1 flex min-w-0">{children}</div>

            <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSent={handleSent} />
        </div>
    );
}