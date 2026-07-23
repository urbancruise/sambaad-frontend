"use client";

import EmployeeHeader from "../components/EmployeeHeader";
import OverviewCards from "../components/OverviewCards";
import PerformanceCard from "../components/performanceCard";
import { useState } from "react";

import ProfileTabs, {ProfileTab} from "../goals/components/Profiletabs";
import GoalPage
from "../goals/page";
import TaskPage
from "../tasks/page/TaskPage";
import ActivityPage
from "../activities/page/ActivityPage";
import TimelinePage
from "../timeline/page/TimelinePage";

import { useEmployeeProfile } from "../hooks/useEmployeeProfile";

export default function EmployeeProfilePage() {
    const [tab, setTab] =

    useState<ProfileTab>(

        "overview"

    );

    const {

        profile,

        loading

    } = useEmployeeProfile();

    if (loading) {

        return (

            <div className="py-20 text-center">

                Loading employee profile...

            </div>

        );

    }

    if (!profile) {

        return (

            <div className="py-20 text-center text-slate-500">

                Employee not found.

            </div>

        );

    }

    return (

        <div className="space-y-8 px-4 py-6 lg:px-1">

            <EmployeeHeader

                fullName={profile.profile.fullName}

                email={profile.profile.email}

                username={profile.profile.username}

                role={profile.profile.role}

                isActive={profile.profile.isActive}

            />
            <ProfileTabs

               value={tab}

               onChange={setTab}

            />

            {tab === "overview" && (

    <>

        <OverviewCards

            overview={profile.overview}

        />

        <PerformanceCard

            performance={profile.performance}

        />

    </>

)}

{tab === "goals" && (

    <GoalPage />

)}
{tab === "tasks" && (

    <TaskPage />

)}
{tab === "activities" && (

    <ActivityPage />

)}
{tab === "timeline" && (

    <TimelinePage />

)}

        </div>

    );

}
