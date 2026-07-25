interface Props {

    overview: {

        totalGoals: number;

        completedGoals: number;

        totalTasks: number;

        completedTasks: number;

        totalActivities: number;

        completedActivities: number;

        pendingActivities: number;

        overdueActivities: number;

    };

}

const Card = ({

    title,

    value,

    color

}: {

    title: string;

    value: number;

    color: string;

}) => (

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <p className="text-sm text-slate-500">

            {title}

        </p>

        <h2 className={`mt-3 text-3xl font-bold ${color}`}>

            {value}

        </h2>

    </div>

);

export default function OverviewCards({

    overview

}: Props) {

    return (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <Card

                title="Goals"

                value={overview.totalGoals}

                color="text-blue-600"

            />

            <Card

                title="Completed Goals"

                value={overview.completedGoals}

                color="text-emerald-600"

            />

            <Card

                title="Tasks"

                value={overview.totalTasks}

                color="text-indigo-600"

            />

            <Card

                title="Completed Tasks"

                value={overview.completedTasks}

                color="text-green-600"

            />

            <Card

                title="Activities"

                value={overview.totalActivities}

                color="text-purple-600"

            />

            <Card

                title="Completed Activities"

                value={overview.completedActivities}

                color="text-emerald-600"

            />

            <Card

                title="Pending Activities"

                value={overview.pendingActivities}

                color="text-amber-600"

            />

            <Card

                title="Overdue Activities"

                value={overview.overdueActivities}

                color="text-red-600"

            />

        </div>

    );

}