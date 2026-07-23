"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Props {

    month: Date;

    onPrev: () => void;

    onNext: () => void;

    onToday: () => void;

}

export default function CalendarHeader({

    month,

    onPrev,

    onNext,

    onToday,

}: Props) {

    return (

        <div className="flex items-center justify-between mb-6">

            <div>

                <h2 className="text-2xl font-bold">

                    {month.toLocaleString(
                        "default",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    )}

                </h2>

            </div>

            <div className="flex items-center gap-3">

                <button
                    onClick={onToday}
                    className="rounded-lg border px-4 py-2 hover:bg-slate-100"
                >
                    Today
                </button>

                <button
                    onClick={onPrev}
                    className="rounded-lg border p-2 hover:bg-slate-100"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    onClick={onNext}
                    className="rounded-lg border p-2 hover:bg-slate-100"
                >
                    <ChevronRight size={18} />
                </button>

            </div>

        </div>

    );

}