"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getFieldSetup, saveFieldSetup } from "../api/rating.service";
import { FieldSetup, ModuleMap } from "../types";
import { MODULE_KEYS, ModuleKey, periodLabel } from "../utils/rating.utils";

interface Props {
    open: boolean;
    employeeId: number | null;
    employeeName: string;
    period: string;
    onClose: () => void;
    onSaved: () => Promise<void> | void;
}

const MODULE_TITLES: Record<ModuleKey, string> = {
    sales: "Performance",
    conduct: "Conduct & Behaviour",
    contribution: "Contribution to Org.",
};

const errMsg = (err: unknown, fallback: string) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;

/**
 * Per-user "Choose fields": only TICK which fields from the
 * sub-department's central list this user gets. Adding/renaming/deleting
 * fields happens in "Manage fields" instead.
 */
export default function FieldManagerModal({ open, employeeId, employeeName, period, onClose, onSaved }: Props) {
    const [setup, setSetup] = useState<FieldSetup | null>(null);
    const [selected, setSelected] = useState<ModuleMap<string[]>>({ sales: [], conduct: [], contribution: [] });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || employeeId === null) return;

        let cancelled = false;
        setLoading(true);
        setError(null);
        setSetup(null);

        getFieldSetup(employeeId, period)
            .then((data: FieldSetup) => {
                if (cancelled) return;
                setSetup(data);
                setSelected({
                    sales: [...data.selected.sales],
                    conduct: [...data.selected.conduct],
                    contribution: [...data.selected.contribution],
                });
            })
            .catch((err) => !cancelled && setError(errMsg(err, "Could not load the fields.")))
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, [open, employeeId, period]);

    if (!open) return null;

    const caps = setup?.caps ?? { sales: 4, conduct: 4, contribution: 2 };

    const toggle = (m: ModuleKey, key: string) =>
        setSelected((s) => {
            if (s[m].includes(key)) return { ...s, [m]: s[m].filter((k) => k !== key) };
            if (s[m].length >= caps[m]) return s; // module is full
            return { ...s, [m]: [...s[m], key] };
        });

    const totalPicked = MODULE_KEYS.reduce((n, m) => n + selected[m].length, 0);
    const canSave = totalPicked > 0 && !saving && !loading;

    const handleSave = async () => {
        if (employeeId === null) return;
        setSaving(true);
        setError(null);
        try {
            await saveFieldSetup(employeeId, { period, selected });
            await onSaved();
            onClose();
        } catch (err) {
            setError(errMsg(err, "Could not save the fields."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            Choose fields - {employeeName}
                        </h3>
                        {setup && (
                            <p className="mt-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                Sub-department: {setup.subDepartment.name ?? `#${setup.subDepartment.id}`}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                        aria-label="Close"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                    Tick the fields this user is rated on, up to {caps.sales} / {caps.conduct} / {caps.contribution}{" "}
                    per module (each field = 5 points). To add or rename fields, use <b>Manage fields</b> at the top.
                    Applies from <b>{periodLabel(period)}</b> onwards - earlier months are not changed.
                </p>

                {loading && <p className="py-8 text-center text-sm text-slate-400">Loading fields...</p>}

                {!loading && setup && (
                    <div className="space-y-4">
                        {MODULE_KEYS.map((m) => {
                            const picked = selected[m].length;

                            return (
                                <div key={m} className="rounded-xl border-2 border-slate-200 p-3 dark:border-slate-700">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                                            {MODULE_TITLES[m]}
                                        </p>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {picked} / {caps[m]} · max {picked * 5}
                                        </span>
                                    </div>

                                    {setup.pool[m].length === 0 ? (
                                        <p className="text-xs italic text-slate-400">
                                            No fields in the sub-department list yet.
                                        </p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {setup.pool[m].map((f) => {
                                                const isOn = selected[m].includes(f.key);
                                                const locked = !isOn && picked >= caps[m];

                                                return (
                                                    <label
                                                        key={f.key}
                                                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                                            locked ? "opacity-40" : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                                        }`}
                                                        title={locked ? "Untick another field first" : undefined}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isOn}
                                                            disabled={locked}
                                                            onChange={() => toggle(m, f.key)}
                                                            className="h-4 w-4 accent-emerald-600"
                                                        />
                                                        <span className="text-slate-700 dark:text-slate-200">{f.label}</span>
                                                        {f.isNumeric && (
                                                            <span className="rounded bg-orange-100 px-1.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                                                                %
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

                <div className="mt-5 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400">
                        {totalPicked === 0 ? "Pick at least one field." : `Max total: ${totalPicked * 5} points`}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
