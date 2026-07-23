"use client";

import { PerformanceAnalytics } from "../../types";

interface Props {
    analytics: PerformanceAnalytics;
}

export default function AnalyticsCard({
    analytics,
}: Props) {

    return (

        <div className="bg-white rounded-2xl border p-6">

            <h2 className="text-xl font-bold mb-6">

                Performance Trend

            </h2>

            <div className="space-y-4">

                {analytics.trend.map(item => (

                    <div
                        key={item.period}
                        className="flex justify-between border rounded-xl p-4"
                    >

                        <div>

                            <h3 className="font-semibold">

                                {item.period}

                            </h3>

                            <p className="text-sm text-slate-500">

                                Completion {item.completionRate}%

                            </p>

                        </div>

                        <div className="text-right">

                            <p className="font-bold">

                                {item.performanceScore}

                            </p>

                            <p className="text-xs">

                                Productivity {item.productivityScore}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}