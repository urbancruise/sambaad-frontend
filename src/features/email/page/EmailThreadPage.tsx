"use client";

import { useParams } from "next/navigation";
import ThreadView from "../component/Threadview";

export default function EmailThreadPage() {
    const params = useParams<{ threadId: string }>();
    return <ThreadView threadId={params.threadId} />;
}