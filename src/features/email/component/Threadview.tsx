"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Reply, ReplyAll, Forward, Star, Trash2, Archive } from "lucide-react";

import { getThread, setFlags, moveToFolder } from "../api/email.service";
import { ThreadEmail, EmailUser } from "../types";
import AttachmentChip from "./AttachmentChip";
import ComposeModal from "./Composemodal";
import { EmailListLoading, EmailListError } from "./EmailListStates";

interface Props {
    threadId: string;
}

export default function ThreadView({ threadId }: Props) {
    const router = useRouter();
    const [emails, setEmails] = useState<ThreadEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [replyState, setReplyState] = useState<{
        emailId: string;
        replyAll?: boolean;
        isForward?: boolean;
        subject: string;
        to?: EmailUser[];
    } | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getThread(threadId);
            setEmails(data);
            setExpandedId(data[data.length - 1]?.id ?? null);
        } catch {
            setError("Unable to load this conversation.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    const latest = emails[emails.length - 1];

    const toggleStar = async (email: ThreadEmail) => {
        const next = !email.myFlags?.isStarred;
        setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, myFlags: { ...e.myFlags!, isStarred: next } } : e)));
        await setFlags(email.id, { isStarred: next });
    };

    const handleTrash = async (emailId: string) => {
        await moveToFolder(emailId, "TRASH");
        router.back();
    };

    const handleArchive = async (emailId: string) => {
        await moveToFolder(emailId, "ARCHIVE");
        router.back();
    };

    if (loading) return <div className="flex-1 bg-white dark:bg-slate-900"><EmailListLoading /></div>;
    if (error) return <div className="flex-1 bg-white dark:bg-slate-900"><EmailListError message={error} onRetry={load} /></div>;
    if (!latest) return null;

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button 
                    onClick={() => router.back()} 
                    className="p-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-base font-bold text-slate-900 dark:text-white truncate flex-1">{latest.subject}</h1>
                
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => toggleStar(latest)} 
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        <Star size={16} fill={latest.myFlags?.isStarred ? "#fbbf24" : "none"} className={latest.myFlags?.isStarred ? "text-amber-400" : "text-slate-400"} />
                    </button>
                    <button 
                        onClick={() => handleArchive(latest.id)} 
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition"
                    >
                        <Archive size={16} />
                    </button>
                    <button 
                        onClick={() => handleTrash(latest.id)} 
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 transition"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Thread Body Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {emails.map((email) => {
                    const isExpanded = expandedId === email.id;
                    return (
                        <div 
                            key={email.id} 
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all"
                        >
                            {/* Email Item Header */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : email.id)}
                                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition text-left"
                            >
                                <div className="min-w-0 pr-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{email.from?.fullName ?? "Unknown"}</p>
                                    {!isExpanded && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                                            {(email.bodyHtml || "").replace(/<[^>]*>/g, " ").slice(0, 100)}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex-shrink-0">
                                    {email.sentAt ? new Date(email.sentAt).toLocaleString() : ""}
                                </span>
                            </button>

                            {/* Email Body & Attachments */}
                            {isExpanded && (
                                <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
                                    <div
                                        className="text-sm text-slate-800 dark:text-slate-200 prose prose-slate prose-sm max-w-none dark:prose-invert leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
                                    />

                                    {email.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {email.attachments.map((att) => (
                                                <AttachmentChip key={att.id} attachment={att} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions Toolbar */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setReplyState({ emailId: email.id, subject: email.subject })}
                                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition"
                                        >
                                            <Reply size={13} /> Reply
                                        </button>
                                        <button
                                            onClick={() => setReplyState({ emailId: email.id, replyAll: true, subject: email.subject })}
                                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition"
                                        >
                                            <ReplyAll size={13} /> Reply All
                                        </button>
                                        <button
                                            onClick={() => setReplyState({ emailId: email.id, isForward: true, subject: email.subject })}
                                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition"
                                        >
                                            <Forward size={13} /> Forward
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Compose Modal */}
            {replyState && (
                <ComposeModal
                    open
                    onClose={() => setReplyState(null)}
                    onSent={load}
                    initial={{
                        replyToEmailId: replyState.emailId,
                        replyAll: replyState.replyAll,
                        isForward: replyState.isForward,
                        subject: replyState.subject,
                        to: replyState.isForward ? [] : undefined,
                    }}
                />
            )}
        </div>
    );
}