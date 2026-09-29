"use client";

interface Props {

    search: string;

    onSearch: (

        value: string

    ) => void;

}

export default function TimelineFilters({

    search,

    onSearch

}: Props) {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4">

            <input

                value={search}

                onChange={(e)=>

                    onSearch(

                        e.target.value

                    )

                }

                placeholder="Search timeline..."

                className="w-full rounded-lg border border-slate-300 px-4 py-2 lg:w-96"

            />

        </div>

    );

}