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
    emerald: { 
        bg: "bg-emerald-50 dark:bg-emerald-950/40", 
        text: "text-emerald-700 dark:text-emerald-400", 
        bar: "bg-emerald-500 dark:bg-emerald-400" 
    },
    blue: { 
        bg: "bg-blue-50 dark:bg-blue-950/40", 
        text: "text-blue-700 dark:text-blue-400", 
        bar: "bg-blue-500 dark:bg-blue-400" 
    },
    amber: { 
        bg: "bg-amber-50 dark:bg-amber-950/40", 
        text: "text-amber-700 dark:text-amber-400", 
        bar: "bg-amber-500 dark:bg-amber-400" 
    },
    orange: { 
        bg: "bg-orange-50 dark:bg-orange-950/40", 
        text: "text-orange-700 dark:text-orange-400", 
        bar: "bg-orange-500 dark:bg-orange-400" 
    },
    rose: { 
        bg: "bg-rose-50 dark:bg-rose-950/40", 
        text: "text-rose-700 dark:text-rose-400", 
        bar: "bg-rose-500 dark:bg-rose-400" 
    },
};

export default function BandSummaryCards({ bandSummary, totalRated }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {bandSummary.map((band) => {
                const c = COLOR_MAP[band.color] ?? COLOR_MAP.rose;
                const pct = totalRated > 0 ? Math.round((band.count / totalRated) * 100) : 0;

                return (
                    <div key={band.key} className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${c.bg}`}>
                        <p className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>{band.label}</p>
                        <p className={`text-3xl font-black mt-2 ${c.text}`}>{band.count}</p>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden dark:bg-slate-700">
                            <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{pct}% of rated team</p>
                    </div>
                );
            })}
        </div>
    );
}