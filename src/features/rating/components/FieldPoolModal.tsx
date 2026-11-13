"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { getFieldPool, getFieldPools, saveFieldPool } from "../api/rating.service";
import { FieldDraft, FieldPool, ManageableSubDepartment, ModuleMap } from "../types";
import { MODULE_KEYS, ModuleKey, newFieldKey, periodLabel } from "../utils/rating.utils";

interface Props {
    open: boolean;
    period: string;
    onClose: () => void;
    onSaved: () => Promise<void> | void;
}

const MODULE_TITLES: Record<ModuleKey, string> = {
    sales: "Performance",
    conduct: "Conduct & Behaviour",
    contribution: "Contribution to Org.",
};

const MODULE_BAR: Record<ModuleKey, string> = {
    sales: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    conduct: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    contribution: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
};

const MAX_POOL = 15;

const errMsg = (err: unknown, fallback: string) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;

/**
 * "Manage fields": the ONE central field list of a sub-department.
 * Add / rename / delete fields here. Users then get a ticked subset of
 * this list via "Choose fields". Changes apply from the viewed month on.
 */
export default function FieldPoolModal({ open, period, onClose, onSaved }: Props) {
    const [subs, setSubs] = useState<ManageableSubDepartment[]>([]);
    const [subId, setSubId] = useState("");
    const [pool, setPool] = useState<ModuleMap<FieldDraft[]>>({ sales: [], conduct: [], contribution: [] });
    const [caps, setCaps] = useState({ sales: 4, conduct: 4, contribution: 2 });
    const [isDefault, setIsDefault] = useState(false);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [loadingPool, setLoadingPool] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sub-departments this person may manage.
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoadingSubs(true);
        setError(null);

        getFieldPools()
            .then((list: ManageableSubDepartment[]) => {
                if (cancelled) return;
                setSubs(list);
                setSubId((cur) => (cur && list.some((s) => String(s.id) === cur) ? cur : list[0] ? String(list[0].id) : ""));
            })
            .catch((err) => !cancelled && setError(errMsg(err, "Could not load sub-departments.")))
            .finally(() => !cancelled && setLoadingSubs(false));

        return () => {
            cancelled = true;
        };
    }, [open]);

    // The chosen sub-department's list for this month.
    useEffect(() => {
        if (!open || !subId) return;
        let cancelled = false;
        setLoadingPool(true);
        setError(null);

        getFieldPool(subId, period)
            .then((data: FieldPool) => {
                if (cancelled) return;
                setPool({
                    sales: data.pool.sales.map((f) => ({ ...f })),
                    conduct: data.pool.conduct.map((f) => ({ ...f })),
                    contribution: data.pool.contribution.map((f) => ({ ...f })),
                });
                setCaps(data.caps);
                setIsDefault(data.isDefaultPool);
            })
            .catch((err) => !cancelled && setError(errMsg(err, "Could not load the field list.")))
            .finally(() => !cancelled && setLoadingPool(false));

        return () => {
            cancelled = true;
        };
    }, [open, subId, period]);

    if (!open) return null;

    const rename = (m: ModuleKey, key: string, patch: Partial<FieldDraft>) =>
        setPool((p) => ({ ...p, [m]: p[m].map((f) => (f.key === key ? { ...f, ...patch } : f)) }));

    const remove = (m: ModuleKey, key: string) =>
        setPool((p) => ({ ...p, [m]: p[m].filter((f) => f.key !== key) }));

    const add = (m: ModuleKey) =>
        setPool((p) => ({ ...p, [m]: [...p[m], { key: newFieldKey(), label: "" }] }));

    const totalFields = MODULE_KEYS.reduce((n, m) => n + pool[m].length, 0);
    const labelsOk = MODULE_KEYS.every((m) => pool[m].every((f) => f.label.trim()));
    const canSave = Boolean(subId) && totalFields > 0 && labelsOk && !saving && !loadingPool;

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const clean = (list: FieldDraft[]) => list.map((f) => ({ ...f, label: f.label.trim() }));
            await saveFieldPool(subId, {
                period,
                pool: { sales: clean(pool.sales), conduct: clean(pool.conduct), contribution: clean(pool.contribution) },
            });
            await onSaved();
            onClose();
        } catch (err) {
            setError(errMsg(err, "Could not save the field list."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Manage fields - sub-department list
                    </h3>
                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                        aria-label="Close"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                    This is the one shared list for the sub-department. Changes apply from{" "}
                    <b>{periodLabel(period)}</b> onwards - earlier months keep their own list. Choose which fields each
                    user gets with <b>Choose fields</b> on their card (up to {caps.sales} / {caps.conduct} /{" "}
                    {caps.contribution}).
                </p>

                <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold text-slate-500">Sub-department</p>
                    <select
                        value={subId}
                        onChange={(e) => setSubId(e.target.value)}
                        disabled={loadingSubs || subs.length === 0}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                        {subs.length === 0 && <option value="">{loadingSubs ? "Loading..." : "No sub-departments"}</option>}
                        {subs.map((s) => (
                            <option key={s.id} value={s.id}>
                                {(s.departmentName ? `${s.departmentName} › ` : "") + (s.name ?? `Sub-department ${s.id}`)}
                            </option>
                        ))}
                    </select>
                    {isDefault && subId && (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                            Showing the department's default fields. Save to make this the sub-department's own list.
                        </p>
                    )}
                </div>

                {loadingPool && <p className="py-8 text-center text-sm text-slate-400">Loading fields...</p>}

                {!loadingPool && subId && (
                    <div className="space-y-4">
                        {MODULE_KEYS.map((m) => (
                            <div key={m} className="overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700">
                                <div className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${MODULE_BAR[m]}`}>
                                    {MODULE_TITLES[m]}
                                </div>

                                <div className="space-y-2 p-3">
                                    {pool[m].length === 0 && (
                                        <p className="text-xs italic text-slate-400">No fields in this module.</p>
                                    )}

                                    {pool[m].map((f) => (
                                        <div key={f.key} className="flex items-center gap-2">
                                            <input
                                                value={f.label}
                                                onChange={(e) => rename(m, f.key, { label: e.target.value })}
                                                maxLength={60}
                                                placeholder="Field name"
                                                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                            />
                                            <label className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(f.isNumeric)}
                                                    onChange={(e) => rename(m, f.key, { isNumeric: e.target.checked })}
                                                />
                                                % value
                                            </label>
                                            <button
                                                onClick={() => remove(m, f.key)}
                                                className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700"
                                                title="Delete from the list"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {pool[m].length < MAX_POOL && (
                                        <button
                                            onClick={() => add(m)}
                                            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                                        >
                                            <Plus size={13} /> Add field
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

                <div className="mt-5 flex justify-end gap-2">
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
                        {saving ? "Saving..." : "Save list"}
                    </button>
                </div>
            </div>
        </div>
    );
}
