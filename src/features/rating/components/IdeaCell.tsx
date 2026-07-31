"use client";

import { useState } from "react";
import { X, Pencil } from "lucide-react";

interface Props {
    label: string;
    value: string;
    editable: boolean;
    onSave: (value: string) => void;
}

export default function IdeaCell({ label, value, editable, onSave }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const openModal = () => {
        setDraft(value);
        setEditing(false);
        setOpen(true);
    };

    const handleSave = () => {
        onSave(draft);
        setEditing(false);
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="text-left text-xs text-slate-600 hover:text-emerald-600 hover:underline truncate max-w-35 block"
                title={value || "— (click to view)"}
            >
                {value ? (value.length > 24 ? `${value.slice(0, 24)}…` : value) : "—"}
            </button>

            {open && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-800">{label}</h3>
                            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={16} />
                            </button>
                        </div>

                        {editing ? (
                            <>
                                <textarea
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    rows={5}
                                    autoFocus
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none"
                                />
                                <div className="mt-4 flex gap-2 justify-end">
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap min-h-15">
                                    {value || <span className="text-slate-400 italic">No entry yet.</span>}
                                </p>
                                {editable && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}