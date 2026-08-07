"use client";

import { useEffect, useRef, useState } from "react";
import { X, Minus, Send, Clock, ChevronDown } from "lucide-react";

import { EmailUser } from "../types";
import { createDraft, autosaveDraft, sendEmail, attachFile } from "../api/email.service";
import RichTextEditor from "./Richtexteditor";
import RecipientPicker from "./Recipientpicker";
import AttachmentDropzone, { PendingAttachment } from "./Attachmentdropzone";

interface Props {
    open: boolean;
    onClose: () => void;
    onSent: () => void;
    /** Pre-fill for Reply/Reply-All/Forward */
    initial?: {
        to?: EmailUser[];
        cc?: EmailUser[];
        subject?: string;
        bodyHtml?: string;
        replyToEmailId?: string;
        replyAll?: boolean;
        isForward?: boolean;
    };
}

export default function ComposeModal({ open, onClose, onSent, initial }: Props) {
    const [minimized, setMinimized] = useState(false);
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    const [to, setTo] = useState<EmailUser[]>(initial?.to ?? []);
    const [cc, setCc] = useState<EmailUser[]>(initial?.cc ?? []);
    const [bcc, setBcc] = useState<EmailUser[]>([]);
    const [subject, setSubject] = useState(initial?.subject ?? "");
    const [bodyHtml, setBodyHtml] = useState(initial?.bodyHtml ?? "");
    const [scheduledAt, setScheduledAt] = useState("");
    const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
    const [sending, setSending] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

    const emailIdRef = useRef<string | null>(null);
    const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Create the draft shell as soon as compose opens — attachments and
    // autosave both need a real emailId to attach to.
    useEffect(() => {
        if (!open || initial?.replyToEmailId) return; // replies send fresh, no draft shell needed
        let cancelled = false;
        createDraft({ subject: initial?.subject ?? "", bodyHtml: initial?.bodyHtml ?? "" }).then((draft) => {
            if (!cancelled) emailIdRef.current = draft.id;
        });
        return () => { cancelled = true; };
    }, [open]);

    const scheduleAutosave = () => {
        if (!emailIdRef.current) return;
        if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        setSaveStatus("saving");
        autosaveTimer.current = setTimeout(async () => {
            if (!emailIdRef.current) return;
            await autosaveDraft(emailIdRef.current, { subject, bodyHtml });
            setSaveStatus("saved");
        }, 1500);
    };

    useEffect(() => {
        if (open && !initial?.replyToEmailId) scheduleAutosave();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject, bodyHtml]);

    const handleFilesAdded = async (files: File[]) => {
        if (!emailIdRef.current) return;
        const newItems: PendingAttachment[] = files.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            progress: 0,
            uploaded: false,
        }));
        setAttachments((prev) => [...prev, ...newItems]);

        for (const item of newItems) {
            try {
                const attachment = await attachFile(emailIdRef.current, item.file, (pct) => {
                    setAttachments((prev) => prev.map((a) => (a.id === item.id ? { ...a, progress: pct } : a)));
                });
                setAttachments((prev) =>
                    prev.map((a) => (a.id === item.id ? { ...a, uploaded: true, progress: 100, attachmentId: attachment.id } : a))
                );
            } catch {
                setAttachments((prev) => prev.filter((a) => a.id !== item.id));
            }
        }
    };

    const reset = () => {
        setTo([]); setCc([]); setBcc([]); setSubject(""); setBodyHtml("");
        setAttachments([]); setScheduledAt(""); setShowCcBcc(false); setShowSchedule(false);
        emailIdRef.current = null;
        setSaveStatus("idle");
    };

    const handleSend = async () => {
        if (to.length === 0) return;
        setSending(true);
        try {
            if (initial?.replyToEmailId) {
                const { replyToEmail } = await import("../api/email.service");
                await replyToEmail(initial.replyToEmailId, {
                    bodyHtml,
                    replyAll: initial.replyAll,
                    forwardTo: initial.isForward ? { to: to.map((u) => u.id), cc: cc.map((u) => u.id) } : undefined,
                });
            } else {
                await sendEmail({
                    emailId: emailIdRef.current ?? undefined,
                    to: to.map((u) => u.id),
                    cc: cc.map((u) => u.id),
                    bcc: bcc.map((u) => u.id),
                    subject,
                    bodyHtml,
                    scheduledAt: scheduledAt || undefined,
                });
            }
            reset();
            onSent();
            onClose();
        } finally {
            setSending(false);
        }
    };

    if (!open) return null;

    if (minimized) {
        return (
            <div
                onClick={() => setMinimized(false)}
                className="fixed bottom-0 right-6 z-[9998] w-72 rounded-t-2xl bg-slate-800 text-white px-4 py-3 flex items-center justify-between cursor-pointer shadow-2xl"
            >
                <span className="text-sm font-semibold truncate">{subject || "New Message"}</span>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }}>
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 right-6 z-[9998] w-[520px] max-w-[calc(100vw-3rem)] rounded-t-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-950 text-white rounded-t-2xl">
                <span className="text-sm font-bold">
                    {initial?.isForward ? "Forward" : initial?.replyToEmailId ? "Reply" : "New Message"}
                </span>
                <div className="flex items-center gap-1">
                    {saveStatus !== "idle" && !initial?.replyToEmailId && (
                        <span className="text-[10px] text-slate-300 mr-2">
                            {saveStatus === "saving" ? "Saving..." : "Saved"}
                        </span>
                    )}
                    <button onClick={() => setMinimized(true)} className="p-1 hover:bg-white/10 rounded">
                        <Minus size={14} />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                <RecipientPicker label="To" selected={to} onChange={setTo} />

                {!showCcBcc && (
                    <button
                        onClick={() => setShowCcBcc(true)}
                        className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-600 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1"
                    >
                        Cc/Bcc <ChevronDown size={12} />
                    </button>
                )}
                {showCcBcc && (
                    <>
                        <RecipientPicker label="Cc" selected={cc} onChange={setCc} />
                        <RecipientPicker label="Bcc" selected={bcc} onChange={setBcc} />
                    </>
                )}

                <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full px-4 py-2.5 text-sm font-semibold border-b border-slate-100 dark:border-slate-800 focus:outline-none dark:bg-transparent dark:text-white"
                />

                <div className="p-3 space-y-3">
                    <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
                    <AttachmentDropzone
                        attachments={attachments}
                        onFilesAdded={handleFilesAdded}
                        onRemove={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
                    />

                    {showSchedule && (
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm dark:bg-slate-800 dark:text-white"
                        />
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handleSend}
                    disabled={sending || to.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-sm disabled:opacity-50 transition"
                >
                    <Send size={14} />
                    {scheduledAt ? "Schedule" : "Send"}
                </button>
                <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    title="Schedule send"
                    className={`p-2.5 rounded-xl border transition ${
                        showSchedule
                            ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                            : "border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Clock size={16} />
                </button>
            </div>
        </div>
    );
}