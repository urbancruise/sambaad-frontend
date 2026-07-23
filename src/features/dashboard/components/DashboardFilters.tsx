"use client";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const filters = [
    "ALL",
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "OVERDUE",
];

export default function DashboardFilters({
    value,
    onChange,
}: Props) {
    return (
        <div className="flex gap-3 flex-wrap">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`px-4 py-2 rounded-xl border transition
                    ${
                        value === filter
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-slate-300"
                    }`}
                >
                    {filter.replace("_", " ")}
                </button>
            ))}
        </div>
    );
}