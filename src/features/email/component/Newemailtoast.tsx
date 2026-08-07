"use client";

import Link from "next/link";
import { Mail, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
    email: { emailId: string; subject: string; threadId: string } | null;
    onClose: () => void;
}

export default function NewEmailToast({ email, onClose }: Props) {
    const pathname = usePathname();
    const basePath = `/${pathname?.split("/")[1] || "employee"}`;

    if (!email) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
                    <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Email</p>
                    <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{email.subject || "(no subject)"}</p>
                    <Link
                        href={`${basePath}/email/thread/${email.threadId}`}
                        onClick={onClose}
                        className="text-xs font-semibold text-emerald-600 hover:underline mt-1 inline-block"
                    >
                        Open
                    </Link>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 flex-shrink-0">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}