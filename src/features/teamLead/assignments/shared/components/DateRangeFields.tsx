"use client";

interface Props {

    startDate: string;

    dueDate: string;

    onStartChange: (value: string) => void;

    onDueChange: (value: string) => void;

}

export default function DateRangeFields({

    startDate,

    dueDate,

    onStartChange,

    onDueChange

}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-2">

            <input

                type="date"

                value={startDate}

                onChange={(e) => onStartChange(e.target.value)}

                className="rounded-lg border p-3"

            />

            <input

                type="date"

                value={dueDate}

                onChange={(e) => onDueChange(e.target.value)}

                className="rounded-lg border p-3"

            />

        </div>

    );

}