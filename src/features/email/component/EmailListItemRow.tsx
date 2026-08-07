"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star, Paperclip, Flag } from "lucide-react";

import { EmailListItem as EmailListItemType } from "../types";

interface Props {
    email: EmailListItemType;
    selected: boolean;
    onToggleSelect: () => void;
    onToggleStar: () => void;
}

const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const date = new Date(iso);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function EmailListItemRow({ email, selected, onToggleSelect, onToggleStar }: Props) {
    const pathname = usePathname();
    const basePath = `/${pathname?.split("/")[1] || "employee"}/email`;

    return (
        <div
            className={`group flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 transition cursor-pointer ${
                selected
                    ? "bg-emerald-50 dark:bg-emerald-500/10"
                    : email.isRead
                    ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                    : "bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold"
            }`}
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded accent-emerald-600 flex-shrink-0"
            />

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar();
                }}
                className="flex-shrink-0 text-slate-900 hover:text-amber-400 transition"
            >
                <Star size={16} fill={email.isStarred ? "#fbbf24" : "none"} className={email.isStarred ? "text-amber-400" : ""} />
            </button>

            {email.isImportant && <Flag size={14} className="text-rose-500 flex-shrink-0" />}

            <Link href={`${basePath}/thread/${email.threadId}`} className="flex-1 min-w-0 flex items-center gap-4">
                <span className="w-40 flex-shrink-0 truncate text-sm text-slate-800 dark:text-slate-100">
                    {email.from?.fullName ?? "Unknown"}
                </span>

                <span className="flex-1 min-w-0 truncate text-sm text-slate-700 dark:text-slate-300">
                    <span className={email.isRead ? "font-normal" : "font-bold text-slate-900 dark:text-white"}>
                        {email.subject || "(no subject)"}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal"> — {email.preview}</span>
                </span>

                {email.hasAttachments && <Paperclip size={14} className="text-slate-400 flex-shrink-0" />}

                <span className="w-16 flex-shrink-0 text-right text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(email.sentAt || email.createdAt)}
                </span>
            </Link>
        </div>
    );
}