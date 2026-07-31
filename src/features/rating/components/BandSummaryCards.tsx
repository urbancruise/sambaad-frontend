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

const COLOR_MAP: Record<string, { bg: string; text: string; bar: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-500" },
};

export default function BandSummaryCards({ bandSummary, totalRated }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {bandSummary.map((band) => {
                const c = COLOR_MAP[band.color] ?? COLOR_MAP.rose;
                const pct = totalRated > 0 ? Math.round((band.count / totalRated) * 100) : 0;

                return (
                    <div key={band.key} className={`rounded-2xl border p-4 ${c.bg}`}>
                        <p className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>{band.label}</p>
                        <p className={`text-3xl font-black mt-2 ${c.text}`}>{band.count}</p>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-white/60 overflow-hidden">
                            <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{pct}% of rated team</p>
                    </div>
                );
            })}
        </div>
    );
}