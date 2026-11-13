"use client";

import { useState } from "react";
import { X, Pencil } from "lucide-react";
import { FieldEntry } from "../types";

interface Props {
    label: string;
    entry?: FieldEntry;
    isNumeric?: boolean;
    editable: boolean;
    onSave: (patch: Partial<FieldEntry>) => void;
}

const ratingColor = (v: number | null | undefined) => {
    if (v === null || v === undefined) return "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500";
    if (v >= 5) return "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400";
    if (v >= 4) return "text-blue-700 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400";
    if (v >= 3) return "text-amber-700 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400";
    return "text-red-700 bg-red-100 dark:bg-red-950/50 dark:text-red-400";
};

export default function FieldCell({ label, entry, isNumeric, editable, onSave }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [remarks, setRemarks] = useState("");
    const [valueDraft, setValueDraft] = useState("");

    const current = {
        rating: entry?.rating ?? null,
        remarks: entry?.remarks ?? "",
        value: entry?.value ?? null,
    };

    const openModal = () => {
        setRating(current.rating);
        setRemarks(current.remarks);
        setValueDraft(current.value === null ? "" : String(current.value));
        setEditing(false);
        setOpen(true);
    };

    const handleSave = () => {
        const patch: Partial<FieldEntry> = { rating, remarks: remarks.trim() };
        if (isNumeric) {
            const n = Number(valueDraft);
            patch.value = valueDraft === "" || Number.isNaN(n) ? null : n;
        }
        onSave(patch);
        setEditing(false);
        setOpen(false);
    };

    const preview = current.remarks
        ? current.remarks.length > 22
            ? `${current.remarks.slice(0, 22)}…`
            : current.remarks
        : "";

    return (
        <>
            <button
                onClick={openModal}
                className="flex min-w-24 max-w-40 flex-col items-start gap-0.5 text-left hover:opacity-80"
                title={current.remarks || "Click to view"}
            >
                <span className="flex items-center gap-1.5">
                    {isNumeric && (
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                            {current.value !== null ? `${current.value}%` : "—"}
                        </span>
                    )}
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${ratingColor(current.rating)}`}>
                        {current.rating ?? "—"}
                    </span>
                </span>
                <span className="block w-full truncate text-xs text-slate-600 dark:text-slate-400">
                    {preview || <span className="text-slate-300 dark:text-slate-600">No remarks</span>}
                </span>
            </button>

            {open && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                                aria-label="Close"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                {isNumeric && (
                                    <div>
                                        <p className="mb-1 text-xs font-semibold text-slate-500">Value (%)</p>
                                        <input
                                            type="number"
                                            min={0}
                                            max={1000}
                                            value={valueDraft}
                                            onChange={(e) => setValueDraft(e.target.value)}
                                            className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                )}

                                <div>
                                    <p className="mb-1 text-xs font-semibold text-slate-500">Rating</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setRating(rating === n ? null : n)}
                                                className={`h-9 w-9 rounded-lg border text-sm font-bold transition ${
                                                    rating === n
                                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-semibold text-slate-500">Remarks</p>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        rows={4}
                                        maxLength={1000}
                                        autoFocus
                                        className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-slate-500">Rating</span>
                                    <span className={`rounded px-2 py-0.5 text-sm font-bold ${ratingColor(current.rating)}`}>
                                        {current.rating ?? "—"}
                                    </span>
                                    {isNumeric && (
                                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                            {current.value !== null ? `${current.value}%` : "—"}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-semibold text-slate-500">Remarks</p>
                                    <p className="min-h-15 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                                        {current.remarks || (
                                            <span className="italic text-slate-400">No remarks yet.</span>
                                        )}
                                    </p>
                                </div>

                                {editable && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70"
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
