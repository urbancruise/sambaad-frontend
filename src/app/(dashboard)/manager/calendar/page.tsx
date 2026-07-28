"use client";

import TeamCalendarPage from "@/src/features/calendar/components/TeamCalendarPage";
import { useManagerTeam } from "@/src/features/manager/team/hooks/useManagerTeam";

export default function ManagerCalendarPage() {
    const { teamLeads, loading } = useManagerTeam();

    const people = teamLeads.map((tl) => ({ id: tl.id, fullName: tl.fullName }));

    return (
        <TeamCalendarPage
            people={people}
            loading={loading}
            selfLabel="My Calendar"
            groupLabel="Team Leads"
        />
    );
}