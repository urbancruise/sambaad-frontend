"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import EmailSidebar from "./EmailSidebar";
import ComposeModal from "./Composemodal";
import NewEmailToast from "./Newemailtoast";
import { useEmailUnread } from "../hooks/useEmailUnread";
import { getLabels } from "../api/email.service";
import { Label } from "../types";

export default function EmailShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const basePath = `/${pathname?.split("/")[1] || "employee"}/email`;

    const { unreadCount, latestEmail, clearLatestEmail } = useEmailUnread();
    const [labels, setLabels] = useState<Label[]>([]);
    const [composeOpen, setComposeOpen] = useState(false);

    useEffect(() => {
        getLabels().then(setLabels).catch(() => setLabels([]));
    }, []);

    const handleSent = () => {
        // A crude but reliable refresh — folder/thread views re-fetch on
        // their own mount, so bouncing back to Inbox after sending
        // guarantees the new state (Sent folder, thread update) is seen.
        router.push(`${basePath}/inbox`);
    };

    return (
        <div className="flex h-full min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950">
            <EmailSidebar unreadCount={unreadCount} labels={labels} onCompose={() => setComposeOpen(true)} />

            <div className="flex-1 flex min-w-0">{children}</div>

            <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSent={handleSent} />

            <NewEmailToast email={latestEmail} onClose={clearLatestEmail} />
        </div>
    );
}