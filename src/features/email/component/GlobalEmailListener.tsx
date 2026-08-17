"use client";

import { useEmailSocket } from "@/src/features/email/hooks/useEmailSocket";
import NewEmailToast from "@/src/features/email/component/Newemailtoast";

/**
 * The ONLY place useEmailSocket() should be called. Previously
 * EmailShell called it too (via useEmailUnread), meaning every visit
 * to /email opened a SECOND socket connection on top of this one, and
 * the toast only ever showed up while already inside the Email
 * module — defeating the point of a real-time "new mail" popup.
 */
export default function GlobalEmailListener() {
    const { latestEmail, clearLatestEmail } = useEmailSocket();

    return <NewEmailToast email={latestEmail} onClose={clearLatestEmail} />;
}