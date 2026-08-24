"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

import RichTextEditor from "../component/Richtexteditor";
import { getSignature, upsertSignature } from "../api/email.service";

export default function EmailSettingsPage() {
    const [content, setContent] = useState("");
    const [isAutoAppend, setIsAutoAppend] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getSignature()
            .then((sig) => {
                if (sig) {
                    setContent(sig.content ?? "");
                    setIsAutoAppend(sig.isAutoAppend ?? true);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await upsertSignature(content, isAutoAppend);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-400">
                <Loader2 size={24} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 max-w-2xl bg-white dark:bg-slate-900">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Email Settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Manage your signature and how it's used when composing mail.
            </p>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        Signature
                    </label>
                    <RichTextEditor value={content} onChange={setContent} placeholder="Your name, title, contact info..." />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isAutoAppend}
                        onChange={(e) => setIsAutoAppend(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-600"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                        Automatically add my signature to new messages
                    </span>
                </label>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-sm disabled:opacity-60 transition"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                    {saving ? "Saving..." : saved ? "Saved" : "Save Signature"}
                </button>
            </div>
        </div>
    );
}