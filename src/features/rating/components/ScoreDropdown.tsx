"use client";

interface Props {
    value: number | null;
    editable: boolean;
    onChange: (value: number) => void;
}

const scoreColor = (value: number | null) => {
    if (value === null) return "text-slate-400";
    if (value >= 5) return "text-emerald-600";
    if (value >= 4) return "text-blue-600";
    if (value >= 3) return "text-amber-600";
    return "text-red-600";
};

export default function ScoreDropdown({ value, editable, onChange }: Props) {
    if (!editable) {
        return (
            <span className={`font-bold ${scoreColor(value)}`}>
                {value ?? "—"}
            </span>
        );
    }

    return (
        <select
            value={value ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-sm font-bold focus:outline-none focus:border-emerald-500 ${scoreColor(value)}`}
        >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
            ))}
        </select>
    );
}