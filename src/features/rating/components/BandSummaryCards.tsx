"use client";

interface BandSummary {
    key: string;
    label: string;
    min: number;
    color: string;
    count: number;
}

interface Props {
    bandSummary: BandSummary[];
    totalRated: number;
}

// Green + dark red are solid with white text; the middle bands are light with black text.
const COLOR_MAP: Record<string, { card: string; track: string; bar: string }> = {
    emerald: { card: "bg-emerald-600 text-white dark:bg-emerald-700", track: "bg-white/30", bar: "bg-white" },
    blue: { card: "bg-blue-100 text-black", track: "bg-black/10", bar: "bg-blue-500" },
    amber: { card: "bg-amber-100 text-black", track: "bg-black/10", bar: "bg-amber-500" },
    orange: { card: "bg-orange-100 text-black", track: "bg-black/10", bar: "bg-orange-500" },
    red: { card: "bg-red-800 text-white dark:bg-red-900", track: "bg-white/30", bar: "bg-white" },
};

const rangeLabel = (min: number, index: number, all: BandSummary[]) => {
    if (min >= 100) return "100%";
    const upper = index === 0 ? 100 : all[index - 1].min - 1;
    return min === 0 ? `Below ${all[index - 1].min}%` : `${min}-${upper}%`;
};

export default function BandSummaryCards({ bandSummary, totalRated }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {bandSummary.map((band, index) => {
                const c = COLOR_MAP[band.color] ?? COLOR_MAP.red;
                const pct = totalRated > 0 ? Math.round((band.count / totalRated) * 100) : 0;

                return (
                    <div key={band.key} className={`rounded-2xl p-4 shadow-sm ${c.card}`}>
                        <p className="text-sm font-bold uppercase tracking-wide">{band.label}</p>
                        <p className="text-xs font-semibold opacity-80">{rangeLabel(band.min, index, bandSummary)}</p>
                        <p className="mt-2 text-4xl font-black">{band.count}</p>
                        <div className={`mt-3 h-2 w-full overflow-hidden rounded-full ${c.track}`}>
                            <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-1 text-xs font-medium opacity-90">{pct}% of rated results</p>
                    </div>
                );
            })}
        </div>
    );
}
