"use client";

interface Props {

    search: string;

    onSearch: (value: string) => void;

    onCreate: () => void;

}

export default function GoalFilters({

    search,

    onSearch,

    onCreate

}: Props) {

    return (

        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">

            <input

                value={search}

                onChange={(e)=>onSearch(e.target.value)}

                placeholder="Search Goal..."

                className="rounded-lg border px-4 py-2 lg:w-96"

            />

            <button

                onClick={onCreate}

                className="rounded-lg bg-slate-900 px-5 py-2 text-white"

            >

                + Assign Goal

            </button>

        </div>

    );

}