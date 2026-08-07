"use client";

import { Archive, Trash2, MailOpen, Mail, Star, AlertOctagon, X } from "lucide-react";
import { BulkAction } from "../types";

interface Props {
    count: number;
    onAction: (action: BulkAction) => void;
    onClear: () => void;
}

export default function BulkActionToolbar({ count, onAction, onClear }: Props) {
    if (count === 0) return null;

    const buttons: { action: BulkAction; icon: typeof Archive; label: string }[] = [
        { action: "read", icon: MailOpen, label: "Mark read" },
        { action: "unread", icon: Mail, label: "Mark unread" },
        { action: "star", icon: Star, label: "Star" },
        { action: "archive", icon: Archive, label: "Archive" },
        { action: "spam", icon: AlertOctagon, label: "Spam" },
        { action: "trash", icon: Trash2, label: "Delete" },
    ];

    return (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <button onClick={onClear} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                <X size={14} />
            </button>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{count} selected</span>

            <div className="flex-1" />

            {buttons.map(({ action, icon: Icon, label }) => (
                <button
                    key={action}
                    onClick={() => onAction(action)}
                    title={label}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>
    );
}