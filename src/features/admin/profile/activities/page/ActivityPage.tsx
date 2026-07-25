"use client";

import {

    useMemo,

    useState

} from "react";
import { Plus } from "lucide-react";

import ActivityFilters from "../components/ActivityFilters";
import ActivityTable from "../components/ActivityTable";
import CreateEmployeeActivityModal from "../components/CreateEmployeeActivityModal";

import {

    useEmployeeActivities

} from "../hooks/useEmployeeActivities";

export default function ActivityPage() {

    const {

        activities,

        loading,

        refreshActivities

    } = useEmployeeActivities();

    const [

        search,

        setSearch

    ] = useState("");

    const [

        status,

        setStatus

    ] = useState("ALL");

    const [createOpen, setCreateOpen] = useState(false);

    const filteredActivities = useMemo(() => {

        return activities.filter(activity => {

            const matchesSearch =

                activity.title

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    );

            const matchesStatus =

                status === "ALL"

                ||

                activity.status === status;

            return (

                matchesSearch &&

                matchesStatus

            );

        });

    }, [

        activities,

        search,

        status

    ]);

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <ActivityFilters

                    search={search}

                    status={status}

                    onSearch={setSearch}

                    onStatusChange={setStatus}

                />

                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition"
                >
                    <Plus size={16} />
                    Add Activity
                </button>
            </div>

            <ActivityTable

                activities={filteredActivities}

                loading={loading}

                onChanged={refreshActivities}

            />

            <CreateEmployeeActivityModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={refreshActivities}
            />

        </div>

    );

}
