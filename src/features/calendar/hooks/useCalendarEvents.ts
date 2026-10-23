"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getCalendar, getTeamCalendar, getUserCalendar } from "../api/calendar.service";
import { normalizeEvents } from "../calendar.utils";
import type { CalendarEvent } from "../types";

interface Options {
    /** Omit for your own calendar. */
    userId?: string | number;
    /** true = everyone in the viewer's team (whole org for admins). */
    team?: boolean;
    start: Date;
    end: Date;
}

export function useCalendarEvents({ userId, team = false, start, end }: Options) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const latest = useRef(0);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const load = useCallback(async () => {
        const id = ++latest.current;
        setLoading(true);
        setError(null);
        try {
            const params = { start: startISO, end: endISO };
            const raw = team
                ? await getTeamCalendar(params)
                : userId
                ? await getUserCalendar(userId, params)
                : await getCalendar(params);
            if (id === latest.current) setEvents(normalizeEvents(raw));
        } catch {
            if (id === latest.current) {
                setEvents([]);
                setError("Unable to load calendar events.");
            }
        } finally {
            if (id === latest.current) setLoading(false);
        }
    }, [userId, team, startISO, endISO]);

    useEffect(() => { load(); }, [load]);

    return { events, loading, error, reload: load };
}