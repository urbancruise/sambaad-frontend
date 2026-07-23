"use client";

import { useEffect, useState } from "react";
import { getMyTeam } from "../../api/teamLeadDashboard.service";

interface TeamMember {
    id: string;
    fullName: string;
    role: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function TeamMemberSelector({
    value,
    onChange
}: Props) {
    const [members, setMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await getMyTeam();
            setMembers(data);
        };
        load();
    }, []);

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
            <option value="">
                Select Team Member
            </option>

            {members.map(member => (
                <option
                    key={member.id}
                    value={member.id}
                >
                    {member.fullName}
                </option>
            ))}
        </select>
    );
}