interface Props {

    fullName: string;

    email: string;

    username: string;

    role: string;

    isActive: boolean;

}

export default function EmployeeHeader({

    fullName,

    email,

    username,

    role,

    isActive

}: Props) {

    return (

        <div className="rounded-2xl bg-slate-900 p-8 text-white shadow">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm uppercase tracking-widest text-emerald-400">

                        Employee Profile

                    </p>

                    <h1 className="mt-2 text-3xl font-bold">

                        {fullName}

                    </h1>

                    <p className="mt-2 text-slate-300">

                        {email}

                    </p>

                    <p className="text-slate-400">

                        @{username}

                    </p>

                </div>

                <div className="text-right">

                    <p className="text-sm text-slate-400">

                        {role}

                    </p>

                    <span

                        className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                            isActive
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                        }`}

                    >

                        {

                            isActive

                                ? "Active"

                                : "Inactive"

                        }

                    </span>

                </div>

            </div>

        </div>

    );

}