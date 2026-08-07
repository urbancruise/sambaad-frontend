"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Inbox, Send, FileText, Clock, AlertOctagon, Trash2, Archive,
    Pencil, Tag,
} from "lucide-react";

import { EmailFolder, FOLDER_LABELS, Label } from "../types";

interface Props {
    unreadCount: number;
    labels: Label[];
    onCompose: () => void;
}

const FOLDER_ICONS: Record<EmailFolder, typeof Inbox> = {
    INBOX: Inbox,
    SENT: Send,
    DRAFTS: FileText,
    SCHEDULED: Clock,
    SPAM: AlertOctagon,
    TRASH: Trash2,
    ARCHIVE: Archive,
};

const FOLDER_ORDER: EmailFolder[] = ["INBOX", "SENT", "DRAFTS", "SCHEDULED", "SPAM", "TRASH", "ARCHIVE"];

export default function EmailSidebar({ unreadCount, labels, onCompose }: Props) {
    const pathname = usePathname();
    const basePath = `/${pathname?.split("/")[1] || "employee"}/email`;

    return (
        <div className="w-60 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-6 overflow-y-auto">
            <button
                onClick={onCompose}
                className="w-full flex items-center gap-2 justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 shadow-sm transition active:scale-95"
            >
                <Pencil size={16} />
                Compose
            </button>

            <nav className="space-y-1">
                {FOLDER_ORDER.map((folder) => {
                    const Icon = FOLDER_ICONS[folder];
                    const href = `${basePath}/${folder.toLowerCase()}`;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={folder}
                            href={href}
                            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                isActive
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon size={16} />
                                {FOLDER_LABELS[folder]}
                            </span>
                            {folder === "INBOX" && unreadCount > 0 && (
                                <span className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}

                <Link
                    href={`${basePath}/starred`}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        pathname === `${basePath}/starred`
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    ⭐ Starred
                </Link>
                <Link
                    href={`${basePath}/important`}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        pathname === `${basePath}/important`
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    🚩 Important
                </Link>
            </nav>

            {labels.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 px-3 mb-2">Labels</p>
                    <div className="space-y-1">
                        {labels.map((l) => (
                            <Link
                                key={l.id}
                                href={`${basePath}/inbox?label=${encodeURIComponent(l.name)}`}
                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <Tag size={14} style={{ color: l.color }} />
                                {l.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}