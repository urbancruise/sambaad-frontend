"use client";

import TeamCalendarPage from "@/src/features/calendar/components/TeamCalendarPage";
import { usehodTeam } from "@/src/features/hod/team/hooks/useHodTeam";

export default function HodCalendarPage() {
    const { teamLeads, loading } = usehodTeam();

    // NOTE: the hook's state key/variable is named "teamLeads" (copied
    // from the Manager pattern) but for HOD these are actually Managers.
    const people = teamLeads.map((m) => ({ id: m.id, fullName: m.fullName }));

    return (
        <TeamCalendarPage
            people={people}
            loading={loading}
            selfLabel="My Calendar"
            groupLabel="Managers"
        />
    );
}