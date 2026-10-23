import type { CalendarEvent, CalendarType } from "./types";

/** 0 = Sunday, 1 = Monday. Change this to move the first day of the week. */
export const WEEK_START = 1;

export type VisualState = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "CANCELLED";

const DAY_MS = 86_400_000;
const PRIORITY_RANK: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

export const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const endOfDay = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const diffDays = (a: Date, b: Date) =>
    Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS);
export const isSameDay = (a: Date, b: Date) => diffDays(a, b) === 0;
export const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() - WEEK_START + 7) % 7));

export const weekdayLabels = () => {
    const sunday = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, i) =>
        addDays(sunday, WEEK_START + i).toLocaleDateString(undefined, { weekday: "short" })
    );
};

/** The visible grid for a month: includes the neighbouring days that fill the first/last week. */
export const getGridRange = (month: Date) => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const gridStart = startOfWeek(first);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((diffDays(first, gridStart) + daysInMonth) / 7);
    const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(gridStart, i));
    return { gridStart, gridEnd: endOfDay(days[days.length - 1]), days, weeks };
};

/* ---------- normalising API data (handles both old and new payload shapes) ---------- */

export const normalizeEvent = (raw: any): CalendarEvent | null => {
    const ext = raw?.extendedProps ?? {};
    const start = raw?.start ?? raw?.startDate;
    if (!raw || !start) return null;
    return {
        id: String(raw.id),
        type: (raw.type ?? ext.type ?? "ACTIVITY") as CalendarType,
        title: raw.title ?? "Untitled",
        status: raw.status ?? ext.status ?? "PENDING",
        priority: raw.priority ?? ext.priority ?? "MEDIUM",
        progress: Number(raw.progress ?? ext.progress ?? 0),
        start,
        end: raw.end ?? raw.dueDate ?? null,
        description: raw.description ?? null,
        assignedToId: raw.assignedToId ?? null,
        assigneeName: raw.assigneeName ?? null,
        parentTitle: raw.parentTitle ?? null,
    };
};

export const normalizeEvents = (raw: unknown): CalendarEvent[] =>
    Array.isArray(raw)
        ? raw.map(normalizeEvent).filter((e): e is CalendarEvent => e !== null)
        : [];

/* ---------- state + ranges ---------- */

export const getVisualState = (e: CalendarEvent, now = new Date()): VisualState => {
    if (e.status === "COMPLETED") return "COMPLETED";
    if (e.status === "CANCELLED") return "CANCELLED";
    // same rule the dashboard uses for "overdue": due date is in the past
    if (e.end && new Date(e.end).getTime() < now.getTime()) return "OVERDUE";
    return e.status === "IN_PROGRESS" ? "IN_PROGRESS" : "PENDING";
};

export const eventRange = (e: CalendarEvent) => {
    const s = startOfDay(new Date(e.start));
    let en = startOfDay(new Date(e.end ?? e.start));
    if (en.getTime() < s.getTime()) en = s;
    return { s, en };
};

export const compareEvents = (a: CalendarEvent, b: CalendarEvent) =>
    new Date(a.start).getTime() - new Date(b.start).getTime() ||
    (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0);

export const eventsOnDay = (events: CalendarEvent[], day: Date) => {
    const d = startOfDay(day).getTime();
    return events
        .filter((e) => {
            const { s, en } = eventRange(e);
            return s.getTime() <= d && d <= en.getTime();
        })
        .sort(compareEvents);
};

/* ---------- week layout: each event becomes a bar in a lane ---------- */

export interface PlacedEvent {
    event: CalendarEvent;
    startCol: number;
    span: number;
    lane: number;
    continuesBefore: boolean;
    continuesAfter: boolean;
}

export const layoutWeek = (weekDays: Date[], events: CalendarEvent[]): PlacedEvent[] => {
    const weekStart = startOfDay(weekDays[0]);
    const items: {
        event: CalendarEvent; startCol: number; endCol: number;
        continuesBefore: boolean; continuesAfter: boolean;
    }[] = [];

    for (const event of events) {
        const { s, en } = eventRange(event);
        const a = diffDays(s, weekStart);
        const b = diffDays(en, weekStart);
        if (b < 0 || a > 6) continue;
        items.push({
            event,
            startCol: Math.max(a, 0),
            endCol: Math.min(b, 6),
            continuesBefore: a < 0,
            continuesAfter: b > 6,
        });
    }

    items.sort(
        (x, y) =>
            x.startCol - y.startCol ||
            (y.endCol - y.startCol) - (x.endCol - x.startCol) ||
            (PRIORITY_RANK[y.event.priority] ?? 0) - (PRIORITY_RANK[x.event.priority] ?? 0) ||
            x.event.title.localeCompare(y.event.title)
    );

    const laneEnds: number[] = [];
    return items.map((it) => {
        let lane = laneEnds.findIndex((end) => end < it.startCol);
        if (lane === -1) { lane = laneEnds.length; laneEnds.push(it.endCol); }
        else laneEnds[lane] = it.endCol;
        return {
            event: it.event,
            startCol: it.startCol,
            span: it.endCol - it.startCol + 1,
            lane,
            continuesBefore: it.continuesBefore,
            continuesAfter: it.continuesAfter,
        };
    });
};

/* ---------- formatting ---------- */

export const initials = (name: string) =>
    name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export const formatDateTime = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const midnight = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;
    return d.toLocaleString(undefined, midnight
        ? { dateStyle: "medium" }
        : { dateStyle: "medium", timeStyle: "short" });
};