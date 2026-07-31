"use client";

export interface Band {
    key: string;
    label: string;
    min: number;
    color: string;
}

interface Props {
    band: Band;
    isFinal: boolean;
    size?: "sm" | "md";
}

const COLOR_MAP: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function RatingBand({ band, isFinal, size = "md" }: Props) {
    const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-bold ${sizeClass} ${COLOR_MAP[band.color] ?? COLOR_MAP.rose}`}
            title={isFinal ? "Official rating" : "Pending senior review — based on self-rating"}
        >
            {band.label}
            {!isFinal && <span className="opacity-60">*</span>}
        </span>
    );
}