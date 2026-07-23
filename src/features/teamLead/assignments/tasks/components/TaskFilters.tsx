"use client";

interface Props{

    search:string;

    onSearch:(value:string)=>void;

    onCreate:()=>void;

}

export default function TaskFilters({

    search,

    onSearch,

    onCreate

}:Props){

    return(

        <div className="flex justify-between rounded-xl border bg-white p-4">

            <input

                value={search}

                onChange={(e)=>onSearch(e.target.value)}

                placeholder="Search Task..."

                className="w-80 rounded-lg border px-4 py-2"

            />

            <button

                onClick={onCreate}

                className="rounded-lg bg-slate-900 px-5 py-2 text-white"

            >

                + Assign Task

            </button>

        </div>

    );

}