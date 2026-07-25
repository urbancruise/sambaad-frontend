"use client";

interface Props {

    search: string;

    status: string;

    onSearch: (

        value: string

    ) => void;

    onStatusChange: (

        value: string

    ) => void;

}

const statuses = [

    "ALL",

    "PENDING",

    "IN_PROGRESS",

    "COMPLETED",

    "CANCELLED"

];

export default function ActivityFilters({

    search,

    status,

    onSearch,

    onStatusChange

}: Props) {

    return (

        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 lg:flex-row lg:justify-between">

            <input

                value={search}

                onChange={(e)=>

                    onSearch(e.target.value)

                }

                placeholder="Search activity..."

                className="rounded-lg border px-4 py-2 lg:w-80"

            />

            <select

                value={status}

                onChange={(e)=>

                    onStatusChange(e.target.value)

                }

                className="rounded-lg border px-4 py-2"

            >

                {

                    statuses.map(status => (

                        <option

                            key={status}

                            value={status}

                        >

                            {status}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}