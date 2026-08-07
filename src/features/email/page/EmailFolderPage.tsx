"use client";

import { useParams } from "next/navigation";
import EmailList from "../component/Emaillist";
import { EmailQueryFolder } from "../types";

export default function EmailFolderPage() {
    const params = useParams<{ folder: string }>();
    const folder = (params.folder?.toUpperCase() ?? "INBOX") as EmailQueryFolder;

    return <EmailList folder={folder} />;
}