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

    const [

        open,

        setOpen,

    ] = useState(false);

    return (

        <div

            className="relative"

            onMouseEnter={() =>

                setOpen(true)

            }

            onMouseLeave={() =>

                setOpen(false)

            }

        >

            <Link

                href={event.navigationUrl}

                className="block"

            >

                <div

                    className="cursor-pointer rounded-md px-2 py-1 text-[10px] font-medium text-white transition hover:scale-[1.03]"

                    style={{

                        background: event.color,

                    }}

                >

                    {event.title}

                </div>

            </Link>

            {

                open && (

                    <EventTooltip

                        event={event}

                    />

                )

            }

        </div>

    );

}