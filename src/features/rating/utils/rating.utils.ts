import {
    FieldEntry,
    RatingBandInfo,
    RatingFieldConfig,
    RatingMaxScores,
    RatingOverall,
    RatingRow,
} from "../types";

export const MODULE_KEYS = ["sales", "conduct", "contribution"] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

export const POINTS_PER_FIELD = 5;

const SCORE_KEY = {
    sales: "salesScore",
    conduct: "conductScore",
    contribution: "contributionScore",
} as const;

// Same thresholds as the backend (Rating.service.js). min = lowest percentage.
export const RATING_BANDS: RatingBandInfo[] = [
    { key: "SUPER_ACHIEVER", label: "Super Achiever", min: 100, color: "emerald" },
    { key: "EXCELLENT_PERFORMER", label: "Excellent Performer", min: 90, color: "blue" },
    { key: "SATISFACTORY_WORK", label: "Satisfactory Work", min: 80, color: "amber" },
    { key: "NEED_IMPROVEMENT", label: "Need Improvement", min: 70, color: "orange" },
    { key: "MUST_DO", label: "MUST PERFORM", min: 0, color: "red" },
];

export const bandFor = (percent: number): RatingBandInfo =>
    RATING_BANDS.find((b) => percent >= b.min) ?? RATING_BANDS[RATING_BANDS.length - 1];

// Colour of a row's total badge - follows the band of its percentage.
export const totalBadgeClass = (percent: number) => {
    switch (bandFor(percent).color) {
        case "emerald":
            return "bg-emerald-600 text-white dark:bg-emerald-500";
        case "blue":
            return "bg-blue-600 text-white dark:bg-blue-500";
        case "amber":
            return "bg-amber-600 text-white dark:bg-amber-600";
        case "orange":
            return "bg-orange-600 text-white dark:bg-orange-600";
        default:
            return "bg-red-800 text-white dark:bg-red-800";
    }
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export const percentOf = (total: number, max: number) => (max > 0 ? round1((total / max) * 100) : 0);

export const emptyRow: RatingRow = {
    salesScore: null,
    conductScore: null,
    contributionScore: null,
    achievementPercent: null,
    fieldEntries: {},
    total: 0,
    percent: 0,
    updatedAt: "",
    raterId: 0,
};

export const emptyEntry: FieldEntry = { rating: null, remarks: "", value: null };

export const maxScores = (fields: RatingFieldConfig): RatingMaxScores => {
    const out = { sales: 0, conduct: 0, contribution: 0, total: 0 };
    for (const m of MODULE_KEYS) {
        out[m] = fields[m].length * POINTS_PER_FIELD;
        out.total += out[m];
    }
    return out;
};

// Module score = SUM of its field ratings (null if nothing is rated yet).
export const moduleScore = (
    fields: { key: string }[],
    entries: Record<string, FieldEntry>
): number | null => {
    const ratings = fields
        .map((f) => entries[f.key]?.rating)
        .filter((r): r is number => typeof r === "number");
    return ratings.length ? ratings.reduce((a, b) => a + b, 0) : null;
};

// Mirrors the backend so the UI updates instantly (the server result
// replaces it a moment later).
export const recomputeRow = (
    row: RatingRow,
    fields: RatingFieldConfig,
    entries: Record<string, FieldEntry>
): RatingRow => {
    const next: RatingRow = { ...row, fieldEntries: entries };

    for (const m of MODULE_KEYS) next[SCORE_KEY[m]] = moduleScore(fields[m], entries);

    const hasAchievement = MODULE_KEYS.some((m) =>
        fields[m].some((f) => f.key === "achievementPercent")
    );
    next.achievementPercent = hasAchievement ? entries.achievementPercent?.value ?? null : null;

    next.total = (next.salesScore ?? 0) + (next.conductScore ?? 0) + (next.contributionScore ?? 0);
    next.percent = percentOf(next.total, maxScores(fields).total);
    return next;
};

const hasScores = (r: RatingRow | null) =>
    !!r && [r.salesScore, r.conductScore, r.contributionScore].some((v) => v !== null);

// Official result = average of the L-1 and L-2 ratings that exist.
export const computeOverall = (
    fields: RatingFieldConfig,
    self: RatingRow | null,
    l1: RatingRow | null,
    l2: RatingRow | null
): RatingOverall => {
    const max = maxScores(fields).total;
    const official = [l1, l2].filter(hasScores) as RatingRow[];
    const source = official.length ? official : hasScores(self) ? [self as RatingRow] : [];

    if (source.length === 0) {
        return { total: 0, max, percent: 0, band: bandFor(0), isFinal: false, levelsRated: 0 };
    }

    const total = round1(source.reduce((s, r) => s + r.total, 0) / source.length);
    const percent = percentOf(total, max);
    return {
        total,
        max,
        percent,
        band: bandFor(percent),
        isFinal: official.length > 0,
        levelsRated: official.length,
    };
};

export const formatRole = (role: string | null | undefined) =>
    (role ?? "").replace(/[_-]+/g, " ").trim();

// Same new key format the field modal uses for brand-new fields.
export const newFieldKey = () => `f_${Math.random().toString(16).slice(2, 10)}`;

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11" -> "Nov 2026"
export const periodLabel = (period: string) => {
    const [y, m] = period.split("-");
    return `${MONTH_NAMES[Number(m) - 1] ?? m} ${y}`;
};
