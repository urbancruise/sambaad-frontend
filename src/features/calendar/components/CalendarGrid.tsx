"use client";

import { CalendarEvent } from "../types";
import CalendarDay from "./CalendarDay";

interface Props {

    month: Date;

    events: CalendarEvent[];

}

export default function CalendarGrid({

    month,

    events,

}: Props) {

    const firstDay =
        new Date(
            month.getFullYear(),
            month.getMonth(),
            1
        );

    const start =
        new Date(firstDay);

    start.setDate(
        firstDay.getDate() -
        firstDay.getDay()
    );

    const days = [];

    for (let i = 0; i < 42; i++) {

        const day =
            new Date(start);

        day.setDate(
            start.getDate() + i
        );

        days.push(day);

    }
    const sortedEvents = [...events].sort(

    (a, b) =>

        a.priority.localeCompare(

            b.priority

        )

);

    return (

        <>

            <div className="grid grid-cols-7 border">

                {

                    [

                        "Sun",

                        "Mon",

                        "Tue",

                        "Wed",

                        "Thu",

                        "Fri",

                        "Sat",

                    ].map(day => (

                        <div

                            key={day}

                            className="border bg-slate-100 py-3 text-center text-sm font-bold"

                        >

                            {day}

                        </div>

                    ))

                }

            </div>

            <div className="grid grid-cols-7 overflow-visible">

                {

                    days.map(day => (

                        <CalendarDay

                            key={day.toISOString()}

                            date={day}

                            currentMonth={
                                month.getMonth()
                            }

                            events={

                                sortedEvents.filter(

                                    e =>

                                        new Date(
                                            e.startDate
                                        ).toDateString()

                                        ===

                                        day.toDateString()

                                )

                            }

                        />

                    ))

                }

            </div>

        </>

    );

}