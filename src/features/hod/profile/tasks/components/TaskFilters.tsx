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

export default function TaskFilters({

    search,

    status,

    onSearch,

    onStatusChange

}: Props) {

    return (

        <div className="flex flex-col lg:flex-row gap-4 justify-between rounded-xl border bg-white p-4">

            <input

                value={search}

                onChange={(e)=>

                    onSearch(

                        e.target.value

                    )

                }

                placeholder="Search task..."

                className="border rounded-lg px-4 py-2 lg:w-80"

            />

            <select

                value={status}

                onChange={(e)=>

                    onStatusChange(

                        e.target.value

                    )

                }

                className="border rounded-lg px-4 py-2"

            >

                {

                    statuses.map(status=>(

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