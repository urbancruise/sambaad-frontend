"use client";

import { History } from "lucide-react";

interface TimelineItem {

    id: string;

    title: string;

    action: string;

    time: string;

    status: string;

}

interface Props {

    timeline: TimelineItem[];

}

export default function TimelineCard({
    timeline,
}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-xl font-bold">
                        Timeline
                    </h2>

                    <p className="text-sm text-slate-500">
                        Latest updates
                    </p>

                </div>

                <History className="text-slate-500" />

            </div>

            <div className="space-y-5">

                {timeline.length === 0 ? (

                    <div className="text-center py-8 text-slate-400">

                        Timeline is empty.

                    </div>

                ) : (

                    timeline.map((item) => (

                        <div
                            key={item.id}
                            className="relative pl-6 border-l-2 border-slate-200"
                        >

                            <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-2" />

                            <h4 className="font-semibold">

                                {item.title}

                            </h4>

                            <p className="text-sm text-slate-600">

                                {item.action}

                            </p>

                            <div className="mt-1 flex justify-between text-xs text-slate-400">

                                <span>{item.status}</span>

                                <span>
                                    {new Date(
                                        item.time
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}