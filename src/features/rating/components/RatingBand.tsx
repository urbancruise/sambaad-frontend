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

// Super Achiever = green / white, MUST DO = dark red / white; the middle three are light with black text.
const COLOR_MAP: Record<string, string> = {
    emerald: "bg-emerald-600 text-white border-emerald-700",
    blue: "bg-blue-100 text-black border-blue-300",
    amber: "bg-amber-100 text-black border-amber-300",
    orange: "bg-orange-100 text-black border-orange-300",
    red: "bg-red-800 text-white border-red-900",
};

export default function RatingBand({ band, isFinal, size = "md" }: Props) {
    const sizeClass = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1 text-sm";

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-bold ${sizeClass} ${COLOR_MAP[band.color] ?? COLOR_MAP.red}`}
            title={isFinal ? "Official result (average of L-1 and L-2)" : "Pending L-1 / L-2 review"}
        >
            {band.label}
            {!isFinal && <span className="opacity-70">*</span>}
        </span>
    );
}
