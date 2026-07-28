"use client";

import TeamCalendarPage from "@/src/features/calendar/components/TeamCalendarPage";
import { useTeam } from "@/src/features/teamLead/team/hooks/useTeam";

export default function TeamLeadCalendarPage() {
    const { members, loading } = useTeam();

    const people = members.map((m) => ({ id: Number(m.id), fullName: m.fullName }));

    return (
        <TeamCalendarPage
            people={people}
            loading={loading}
            selfLabel="My Calendar"
            groupLabel="Employees"
        />
    );
}