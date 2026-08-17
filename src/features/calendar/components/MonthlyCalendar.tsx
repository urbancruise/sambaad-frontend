"use client";

import {
    useState,
} from "react";

import {
    useCalendar,
} from "../hooks/useCalendar";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

export default function MonthCalendar() {
    const {
        items,
    } = useCalendar();

    const [
        month,
        setMonth,
    ] = useState(
        new Date()
    );

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CalendarHeader
                month={month}
                onToday={() =>
                    setMonth(
                        new Date()
                    )
                }
                onPrev={() =>
                    setMonth(
                        new Date(
                            month.getFullYear(),
                            month.getMonth() - 1,
                            1
                        )
                    )
                }
                onNext={() =>
                    setMonth(
                        new Date(
                            month.getFullYear(),
                            month.getMonth() + 1,
                            1
                        )
                    )
                }
            />

            <div className="relative overflow-visible">
                <CalendarGrid
                    month={month}
                    events={items}
                />
            </div>
        </div>
    );
}