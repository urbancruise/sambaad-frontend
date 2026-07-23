"use client";

import { Activity } from "../types";
import ActivityRow from "./ActivityRow";

interface Props {
    activities: Activity[];
}

export default function ActivityList({ activities }: Props) {
    if (activities.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-6 text-center text-sm text-slate-400">
                No activities yet
            </div>
        );
    }

    return (
        /* Using inline styles guarantees the max-height (300px = ~7 rows) and vertical scrollbar will activate without relying on Tailwind JIT compilation */
        <div 
            style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto' }}
            className="w-full rounded-xl border border-slate-300 bg-slate-100/40 dark:bg-cyan-400/130 shadow-inner scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent"
        >
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-300 text-[12px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-500 border-b border-slate-700/80 backdrop-blur-md shadow-sm">
                    <tr>
                        <th className="py-2.5 px-4 w-full">Activity Name</th>
                        <th className="py-2.5 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                    {activities.map((activity) => (
                        <ActivityRow key={activity.id} activity={activity} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}