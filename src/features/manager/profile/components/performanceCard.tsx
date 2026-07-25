interface Props {

    performance: {

        performanceScore: number;

        completionRate: number;

        productivityScore: number;

    };

}

const ProgressBar = ({

    label,

    value,

    color

}: {

    label: string;

    value: number;

    color: string;

}) => (

    <div>

        <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-medium text-slate-600">

                {label}

            </span>

            <span className="text-sm font-semibold">

                {value.toFixed(1)}%

            </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div

                className={`h-full rounded-full ${color}`}

                style={{

                    width: `${Math.min(value, 100)}%`

                }}

            />

        </div>

    </div>

);

export default function PerformanceCard({

    performance

}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold">

                        Performance Overview

                    </h2>

                    <p className="text-sm text-slate-500">

                        Latest monthly performance metrics

                    </p>

                </div>

                <div className="rounded-xl bg-slate-900 px-8 py-6 text-center text-white">

                    <p className="text-sm uppercase tracking-wider text-slate-400">

                        Overall Score

                    </p>

                    <h1 className="mt-2 text-5xl font-bold text-emerald-400">

                        {performance.performanceScore.toFixed(1)}

                    </h1>

                </div>

            </div>

            <div className="space-y-6">

                <ProgressBar

                    label="Performance Score"

                    value={performance.performanceScore}

                    color="bg-emerald-500"

                />

                <ProgressBar

                    label="Completion Rate"

                    value={performance.completionRate}

                    color="bg-blue-500"

                />

                <ProgressBar

                    label="Productivity Score"

                    value={performance.productivityScore}

                    color="bg-purple-500"

                />

            </div>

        </div>

    );

}