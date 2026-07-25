"use client";

import {

    useMemo,

    useState

} from "react";

import TimelineFilters from "../component/TimelineFilters";
import TimelineList from "../component/TimelineList";

import {

    useEmployeeTimeline

} from "../hooks/useEmployeeTimeline";

export default function TimelinePage() {

    const {

        timeline,

        loading

    } = useEmployeeTimeline();

    const [

        search,

        setSearch

    ] = useState("");

    const filteredTimeline = useMemo(() => {

        return timeline.filter(item =>

            item.activity.title

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

        );

    }, [

        timeline,

        search

    ]);

    return (

        <div className="space-y-6">

            <TimelineFilters

                search={search}

                onSearch={setSearch}

            />

            <TimelineList

                timeline={filteredTimeline}

                loading={loading}

            />

        </div>

    );

}