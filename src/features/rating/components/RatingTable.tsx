"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Settings2 } from "lucide-react";

import { RatingCard, FieldEntry, RatingRow, RowType } from "../types";
import FieldCell from "./FieldCell";
import FieldManagerModal from "./FieldManagerModal";
import RatingBand from "./RatingBand";
import { ModuleKey, emptyRow, formatRole, periodLabel, totalBadgeClass } from "../utils/rating.utils";

interface Props {
    cards: RatingCard[];
    currentUserId: number;
    loading: boolean;
    onEntryChange: (
        employeeId: number,
        period: string,
        rowType: RowType,
        fieldKey: string,
        patch: Partial<FieldEntry>
    ) => void;
    onFieldsSaved: () => Promise<void> | void;
}

// Thin, light coloured left edge per module.
// Full class names are written out so Tailwind can see them.
const MODULES: {
    key: ModuleKey;
    title: string;
    scoreKey: "salesScore" | "conductScore" | "contributionScore";
    headClass: string;
    borderClass: string;
}[] = [
    {
        key: "sales",
        title: "Performance",
        scoreKey: "salesScore",
        headClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
        borderClass: "border-l-2 border-l-rose-300 dark:border-l-rose-800",
    },
    {
        key: "conduct",
        title: "Conduct & Behaviour",
        scoreKey: "conductScore",
        headClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
        borderClass: "border-l-2 border-l-blue-300 dark:border-l-blue-800",
    },
    {
        key: "contribution",
        title: "Contribution to Org.",
        scoreKey: "contributionScore",
        headClass: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
        borderClass: "border-l-2 border-l-violet-300 dark:border-l-violet-800",
    },
];

// Light, stable-per-user tint for each card's name bar.
const NAME_TINTS = [
    "bg-rose-50 dark:bg-rose-950/30",
    "bg-sky-50 dark:bg-sky-950/30",
    "bg-amber-50 dark:bg-amber-950/30",
    "bg-emerald-50 dark:bg-emerald-950/30",
    "bg-violet-50 dark:bg-violet-950/30",
    "bg-orange-50 dark:bg-orange-950/30",
    "bg-teal-50 dark:bg-teal-950/30",
    "bg-fuchsia-50 dark:bg-fuchsia-950/30",
];
const tintFor = (id: number) => NAME_TINTS[Math.abs(id) % NAME_TINTS.length];

const scoreColor = (score: number | null, max: number) => {
    if (score === null || max === 0) return "text-slate-400";
    const pct = (score / max) * 100;
    if (pct >= 100) return "text-emerald-600";
    if (pct >= 80) return "text-blue-600";
    if (pct >= 70) return "text-amber-600";
    return "text-red-600";
};

const Pill = ({ children, tone }: { children: React.ReactNode; tone: "dept" | "sub" | "you" | "warn" }) => {
    const tones = {
        dept: "bg-white/70 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        sub: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
        you: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
        warn: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    };
    return (
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tones[tone]}`}>
            {children}
        </span>
    );
};

export default function RatingTable({ cards, currentUserId, loading, onEntryChange, onFieldsSaved }: Props) {
    const [managing, setManaging] = useState<RatingCard | null>(null);
    // Cards start collapsed (open by default only when a single card is on screen).
    const [open, setOpen] = useState<Record<string, boolean>>({});

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                Loading ratings...
            </div>
        );
    }

    if (!cards.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No ratings to show</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No results found for this filter.</p>
            </div>
        );
    }

    // Group by person; the server already sorted senior -> junior, newest month first.
    const people: { id: number; cards: RatingCard[] }[] = [];
    for (const c of cards) {
        const last = people[people.length - 1];
        if (last && last.id === c.id) last.cards.push(c);
        else people.push({ id: c.id, cards: [c] });
    }

    const renderRow = (
        emp: RatingCard,
        rowType: RowType,
        row: RatingRow | null,
        label: string,
        editable: boolean,
        isFirstRow: boolean
    ) => {
        const r = row ?? emptyRow;

        return (
            <tr
                key={`${emp.id}-${emp.period}-${rowType}`}
                className={`border-b border-slate-100 dark:border-slate-800 ${
                    isFirstRow ? "" : "bg-slate-50/40 dark:bg-slate-800/20"
                }`}
            >
                <td className="px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</td>

                {MODULES.map((m) => {
                    const fields = emp.fields[m.key];
                    const max = emp.maxScores[m.key];
                    return (
                        <Cells key={m.key}>
                            {fields.map((f, i) => (
                                <td
                                    key={f.key}
                                    className={`px-3 py-2 align-top ${i === 0 ? m.borderClass : ""}`}
                                >
                                    <FieldCell
                                        label={f.label}
                                        entry={r.fieldEntries[f.key]}
                                        isNumeric={f.isNumeric}
                                        editable={editable}
                                        onSave={(patch) => onEntryChange(emp.id, emp.period, rowType, f.key, patch)}
                                    />
                                </td>
                            ))}
                            <td
                                className={`bg-slate-50/70 px-3 py-2 text-center dark:bg-slate-800/40 ${
                                    fields.length === 0 ? m.borderClass : ""
                                }`}
                                title="Sum of this module's field ratings"
                            >
                                <span className={`text-sm font-bold ${scoreColor(r[m.scoreKey], max)}`}>
                                    {r[m.scoreKey] ?? "—"}
                                </span>
                                <span className="text-xs text-slate-400">/{max}</span>
                            </td>
                        </Cells>
                    );
                })}

                <td className="border-l-2 border-l-slate-400 px-3 py-2 text-center dark:border-l-slate-600">
                    <span className={`inline-block min-w-8 rounded-md px-2 py-1 text-sm font-bold ${totalBadgeClass(r.percent)}`}>
                        {r.total}/{emp.maxScores.total}
                    </span>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{r.percent}%</p>
                </td>

                {isFirstRow && (
                    <td
                        rowSpan={2}
                        className="border-l-2 border-l-slate-400 px-3 py-2 text-center align-middle dark:border-l-slate-600"
                    >
                        <RatingBand band={emp.overall.band} isFinal={emp.overall.isFinal} size="sm" />
                        <p className="mt-1 text-sm font-black text-slate-700 dark:text-slate-200">
                            {emp.overall.percent}%
                        </p>
                    </td>
                )}
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            {people.map((person) => {
                const first = person.cards[0];

                return (
                    <section key={person.id} className="space-y-2">
                        {/* Person heading */}
                        <div className={`flex flex-wrap items-center gap-2 rounded-xl border-2 border-slate-200 px-4 py-2.5 dark:border-slate-700 ${tintFor(first.id)}`}>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{first.fullName}</h3>
                            {first.id === currentUserId && <Pill tone="you">You</Pill>}
                            <Pill tone="dept">{first.departmentName ?? "Unassigned"}</Pill>
                            {first.subDepartmentName && <Pill tone="sub">{first.subDepartmentName}</Pill>}
                            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
                                {formatRole(first.role).toLowerCase()}
                            </span>
                        </div>

                        {/* One collapsible card per month */}
                        {person.cards.map((emp) => {
                            const key = `${emp.id}-${emp.period}`;
                            const isOpen = open[key] ?? cards.length === 1;

                            return (
                                <div
                                    key={key}
                                    className="ml-0 overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm sm:ml-4 dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <div
                                        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 ${
                                            isOpen ? "border-b-2 border-slate-200 dark:border-slate-700" : ""
                                        }`}
                                    >
                                        <button
                                            onClick={() => setOpen((o) => ({ ...o, [key]: !isOpen }))}
                                            aria-expanded={isOpen}
                                            className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left"
                                        >
                                            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                                                {periodLabel(emp.period)}
                                            </span>
                                            <span className="text-xs text-slate-600 dark:text-slate-300">
                                                Overall{" "}
                                                <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                                                    {emp.overall.total}/{emp.overall.max}
                                                </span>{" "}
                                                <span className="font-bold">({emp.overall.percent}%)</span>
                                            </span>
                                            <RatingBand band={emp.overall.band} isFinal={emp.overall.isFinal} size="sm" />
                                        </button>

                                        {isOpen && emp.canEditFields && (
                                            <button
                                                onClick={() => setManaging(emp)}
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                            >
                                                <Settings2 size={13} />
                                                Choose fields
                                            </button>
                                        )}
                                    </div>

                                    {isOpen && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wide dark:bg-slate-800/80">
                                            <th rowSpan={2} className="px-3 py-2"></th>
                                            {MODULES.map((m) => (
                                                <th
                                                    key={m.key}
                                                    colSpan={emp.fields[m.key].length + 1}
                                                    className={`px-3 py-2 text-center ${m.headClass} ${m.borderClass}`}
                                                >
                                                    {m.title}{" "}
                                                    <span className="font-semibold normal-case opacity-70">
                                                        (/{emp.maxScores[m.key]})
                                                    </span>
                                                </th>
                                            ))}
                                            <th
                                                rowSpan={2}
                                                className="border-l-2 border-l-slate-400 bg-slate-800 px-3 py-2 text-center text-white dark:border-l-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                            >
                                                Total (/{emp.maxScores.total})
                                            </th>
                                            <th
                                                rowSpan={2}
                                                className="border-l-2 border-l-slate-400 bg-slate-800 px-3 py-2 text-center text-white dark:border-l-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                            >
                                                Result
                                            </th>
                                        </tr>
                                        <tr className="bg-slate-50/60 text-[11px] font-semibold text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                            {MODULES.map((m) => (
                                                <Cells key={m.key}>
                                                    {emp.fields[m.key].map((f, i) => (
                                                        <th
                                                            key={f.key}
                                                            className={`px-3 py-1 text-left font-semibold ${i === 0 ? m.borderClass : ""}`}
                                                        >
                                                            {f.label}
                                                        </th>
                                                    ))}
                                                    <th
                                                        className={`px-3 py-1 text-center ${
                                                            emp.fields[m.key].length === 0 ? m.borderClass : ""
                                                        }`}
                                                    >
                                                        Score
                                                    </th>
                                                </Cells>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* TEMPORARILY HIDDEN: self rating.
                                            To bring it back: uncomment the line below, change its last
                                            argument and the L-1 row's last argument so only Self is `true`,
                                            and set rowSpan={3} on the Result cell in renderRow.
                                        {renderRow(emp, "self", emp.self, "Self", emp.id === currentUserId, true)} */}
                                        {renderRow(emp, "senior", emp.senior, "L-1", emp.canEditL1, true)}
                                        {renderRow(emp, "superSenior", emp.superSenior, "L-2", emp.canEditL2, false)}
                                    </tbody>
                                </table>
                            </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                );
            })}

            <FieldManagerModal
                open={managing !== null}
                employeeId={managing?.id ?? null}
                employeeName={managing?.fullName ?? ""}
                period={managing?.period ?? ""}
                onClose={() => setManaging(null)}
                onSaved={onFieldsSaved}
            />
        </div>
    );
}

// Thin wrapper so a module's cells can be grouped without an extra DOM node.
function Cells({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
