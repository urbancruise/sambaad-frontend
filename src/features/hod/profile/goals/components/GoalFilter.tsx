"use client";

interface Props {

    search: string;

    status: string;

    onSearch: (value: string) => void;

    onStatusChange: (value: string) => void;

}

const statuses = [

    "ALL",

    "PENDING",

    "IN_PROGRESS",

    "COMPLETED",

    "CANCELLED"

];

export default function GoalFilters({

    search,

    status,

    onSearch,

    onStatusChange

}: Props) {

    return (

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

            <input

                type="text"

                value={search}

                placeholder="Search goal..."

                onChange={(e)=>

                    onSearch(e.target.value)

                }

                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 lg:max-w-sm"

            />

            <select

                value={status}

                onChange={(e)=>

                    onStatusChange(e.target.value)

                }

                className="rounded-lg border border-slate-300 px-4 py-2"

            >

                {

                    statuses.map(item=>(

                        <option

                            key={item}

                            value={item}

                        >

                            {item}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}