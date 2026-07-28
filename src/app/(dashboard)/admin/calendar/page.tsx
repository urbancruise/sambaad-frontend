"use client";

import TeamCalendarPage from "@/src/features/calendar/components/TeamCalendarPage";
import { useAdminTeam } from "@/src/features/admin/team/hooks/UseadminTeam";

export default function AdminCalendarPage() {
    const { users, loading } = useAdminTeam();

    const people = users.map((u) => ({ id: u.id, fullName: `${u.fullName} (${u.role})` }));

    return (
        <TeamCalendarPage
            people={people}
            loading={loading}
            selfLabel="My Calendar"
            groupLabel="Organization"
        />
    );
}