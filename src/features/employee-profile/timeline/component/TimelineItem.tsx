"use client";

import { EmployeeTimeline } from "../types";

interface Props {

    item: EmployeeTimeline;

}

export default function TimelineItem({

    item

}: Props) {

    return (

        <div className="relative flex gap-5">

            <div className="flex flex-col items-center">

                <div className="h-4 w-4 rounded-full bg-blue-600" />

                <div className="mt-1 h-full w-[2px] bg-slate-200" />

            </div>

            <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h3 className="font-semibold text-slate-900">

                            {item.activity.title}

                        </h3>

                        <p className="mt-1 text-sm text-slate-500">

                            Goal : {item.activity.task.goal.title}

                        </p>

                        <p className="text-sm text-slate-500">

                            Task : {item.activity.task.title}

                        </p>

                    </div>

                    <span className="text-sm text-slate-500">

                        {

                            new Date(

                                item.createdAt

                            ).toLocaleString()

                        }

                    </span>

                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                        {item.action}

                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

                        {item.user.fullName}

                    </span>

                </div>

                {

                    item.remarks && (

                        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">

                            {item.remarks}

                        </div>

                    )

                }

            </div>

        </div>

    );

}