"use client";

import {

    useMemo,

    useState

} from "react";
import { Plus } from "lucide-react";

import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import CreateEmployeeTaskModal from "../components/CreateEmployeeTaskModal";

import {

    useEmployeeTasks

} from "../hooks/useEmployeeTasks";

export default function TaskPage() {

    const {

        tasks,

        loading,

        refreshTasks

    } = useEmployeeTasks();

    const [

        search,

        setSearch

    ] = useState("");

    const [

        status,

        setStatus

    ] = useState("ALL");

    const [createOpen, setCreateOpen] = useState(false);

    const filteredTasks = useMemo(() => {

        return tasks.filter(task => {

            const matchesSearch =

                task.title

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    );

            const matchesStatus =

                status === "ALL"

                ||

                task.status === status;

            return (

                matchesSearch &&

                matchesStatus

            );

        });

    }, [

        tasks,

        search,

        status

    ]);

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <TaskFilters

                    search={search}

                    status={status}

                    onSearch={setSearch}

                    onStatusChange={setStatus}

                />

                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Task
                </button>
            </div>

            <TaskTable

                tasks={filteredTasks}

                loading={loading}

                onChanged={refreshTasks}

            />

            <CreateEmployeeTaskModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={refreshTasks}
            />

        </div>

    );

}
