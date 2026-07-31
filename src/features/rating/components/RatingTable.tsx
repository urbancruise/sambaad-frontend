"use client";

import { Fragment } from "react";
import { EmployeeRating, RatingFieldConfig, RatingRow } from "../types";
import ScoreDropdown from "./ScoreDropdown";
import IdeaCell from "./IdeaCell";
import RatingBand from "./RatingBand";
import AchievementInput from "./AchievementInput";

interface Props {
    employees: EmployeeRating[];
    teamAverage: number;
    currentUserId: number;
    loading: boolean;
    onFieldChange: (
        employeeId: number,
        rowType: "self" | "senior",
        patch: Partial<{ salesScore: number; conductScore: number; contributionScore: number; achievementPercent: number; extraFields: Record<string, string> }>
    ) => void;
}

const emptyRow: RatingRow = {
    salesScore: null,
    conductScore: null,
    contributionScore: null,
    achievementPercent: null,
    extraFields: {},
    total: 0,
    updatedAt: "",
    raterId: 0,
};

const totalBadge = (total: number) => {
    if (total >= 13) return "bg-emerald-600 text-white";
    if (total >= 10) return "bg-amber-500 text-white";
    return "bg-rose-600 text-white";
};

export default function RatingTable({ employees, teamAverage, currentUserId, loading, onFieldChange }: Props) {
    if (loading) {
        return <div className="rounded-xl border bg-white p-10 text-center text-slate-400">Loading ratings...</div>;
    }

    if (!employees.length) {
        return (
            <div className="rounded-xl border border-dashed bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-700">No one to rate here</h3>
                <p className="mt-2 text-sm text-slate-500">No team members found for this filter.</p>
            </div>
        );
    }

    const fields: RatingFieldConfig = employees[0].fields;

    const renderRow = (
        emp: EmployeeRating,
        rowType: "self" | "senior",
        row: RatingRow | null,
        roleLabel: string,
        editable: boolean,
        isFirstRow: boolean
    ) => {
        const r = row ?? emptyRow;

        const patch = (p: Partial<Parameters<Props["onFieldChange"]>[2]>) =>
            onFieldChange(emp.id, rowType, p);

        const patchExtra = (key: string, value: string) =>
            patch({ extraFields: { ...r.extraFields, [key]: value } });

        return (
            <tr key={`${emp.id}-${rowType}`} className={`border-b border-slate-100 ${isFirstRow ? "border-t-2 border-t-slate-200" : ""}`}>
                {isFirstRow && (
                    <td rowSpan={2} className="px-3 py-2 align-top font-bold text-slate-800 whitespace-nowrap">
                        {emp.fullName}
                    </td>
                )}
                <td className="px-3 py-2 text-xs font-semibold text-slate-500">{roleLabel}</td>

                {fields.sales.map((f) =>
                    f.isNumeric ? (
                        <td key={f.key} className="px-3 py-2 text-center">
                            <AchievementInput
                                value={r.achievementPercent}
                                editable={editable}
                                onSave={(v) => patch({ achievementPercent: v })}
                            />
                        </td>
                    ) : (
                        <td key={f.key} className="px-3 py-2">
                            <IdeaCell
                                label={f.label}
                                value={r.extraFields?.[f.key] ?? ""}
                                editable={editable}
                                onSave={(v) => patchExtra(f.key, v)}
                            />
                        </td>
                    )
                )}
                <td className="px-3 py-2 text-center">
                    <ScoreDropdown value={r.salesScore} editable={editable} onChange={(v) => patch({ salesScore: v })} />
                </td>

                {fields.conduct.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                        <IdeaCell
                            label={f.label}
                            value={r.extraFields?.[f.key] ?? ""}
                            editable={editable}
                            onSave={(v) => patchExtra(f.key, v)}
                        />
                    </td>
                ))}
                <td className="px-3 py-2 text-center">
                    <ScoreDropdown value={r.conductScore} editable={editable} onChange={(v) => patch({ conductScore: v })} />
                </td>

                {fields.contribution.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                        <IdeaCell
                            label={f.label}
                            value={r.extraFields?.[f.key] ?? ""}
                            editable={editable}
                            onSave={(v) => patchExtra(f.key, v)}
                        />
                    </td>
                ))}
                <td className="px-3 py-2 text-center">
                    <ScoreDropdown value={r.contributionScore} editable={editable} onChange={(v) => patch({ contributionScore: v })} />
                </td>

                <td className="px-3 py-2 text-center">
                    <span className={`inline-block min-w-[32px] rounded-md px-2 py-1 text-sm font-bold ${totalBadge(r.total)}`}>
                        {r.total}
                    </span>
                </td>

                {isFirstRow && (
                    <td rowSpan={2} className="px-3 py-2 text-center align-middle">
                        <RatingBand band={emp.overall.band} isFinal={emp.overall.isFinal} size="sm" />
                    </td>
                )}
            </tr>
        );
    };

    return (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th colSpan={fields.sales.length + 1} className="px-3 py-2 text-center text-rose-600">Performance</th>
                        <th colSpan={fields.conduct.length + 1} className="px-3 py-2 text-center text-blue-600">Conduct & Behaviour</th>
                        <th colSpan={fields.contribution.length + 1} className="px-3 py-2 text-center text-slate-700">Contribution to Org.</th>
                        <th className="px-3 py-2 text-center bg-slate-800 text-white">Rating (/15)</th>
                        <th className="px-3 py-2 text-center bg-slate-800 text-white">Band</th>
                    </tr>
                    <tr className="bg-slate-50/60 text-[10px] font-semibold text-slate-400">
                        <th></th>
                        <th></th>
                        {fields.sales.map((f) => <th key={f.key} className="px-3 py-1 text-left font-semibold">{f.label}</th>)}
                        <th className="px-3 py-1 text-center">Score</th>
                        {fields.conduct.map((f) => <th key={f.key} className="px-3 py-1 text-left font-semibold">{f.label}</th>)}
                        <th className="px-3 py-1 text-center">Score</th>
                        {fields.contribution.map((f) => <th key={f.key} className="px-3 py-1 text-left font-semibold">{f.label}</th>)}
                        <th className="px-3 py-1 text-center">Score</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <Fragment key={emp.id}>
                            {renderRow(emp, "self", emp.self, "Self", emp.id === currentUserId, true)}
                           
                            {renderRow(emp, "senior", emp.senior, "Senior", emp.canEditSenior, false)}
                        </Fragment>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-slate-900 text-white">
                        <td colSpan={fields.sales.length + fields.conduct.length + fields.contribution.length + 5} className="px-3 py-3 text-center font-bold">
                            Team Average
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-emerald-400">{teamAverage}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}