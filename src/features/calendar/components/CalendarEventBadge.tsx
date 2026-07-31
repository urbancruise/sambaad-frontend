"use client";

import Link from "next/link";
import { useState } from "react";

import { CalendarEvent } from "../types";
import EventTooltip from "./EventTooltip";

interface Props {
    event: CalendarEvent;
}

export default function CalendarEventBadge({
    event,
}: Props) {
    const [open, setOpen] = useState(false);

    const Badge = (
        <div
            className="cursor-pointer rounded-md px-1 text-[12px] font-xs text-black transition hover:scale-[1.03]"
            style={{
                background: event.color,
            }}
        >
            {event.title} :{event.dueDate}
        </div>
    );

    return (
        <div
            className="relative z-10 hover:z-30"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {event.navigationUrl ? (
                <Link
                    href={event.navigationUrl}
                    className="block"
                >
                    {Badge}
                </Link>
            ) : (
                Badge
            )}

            {open && (
                <EventTooltip event={event} />
            )}
        </div>
    );
}