"use client";

import { useAuth } from "@/src/features/auth/hooks/useAuth";

import {

    useTeamMembers

} from "./hooks/useTeamMembers";

interface Props {

    value: string;

    onChange: (

        value: string

    ) => void;

}

export default function EmployeeSelector({

    value,

    onChange

}: Props){

    const {

        user

    } = useAuth();

    const {

        members

    } = useTeamMembers();

    return(

        <select

            value={value}

            onChange={(e)=>

                onChange(

                    e.target.value

                )

            }

            className="w-full rounded-lg border p-3"

        >

            <option value="">

                Select Employee

            </option>

            {

                user && (

                    <option

                        value={user.id}

                    >

                        Assign To Me

                    </option>

                )

            }

            {

                members.map(member=>(

                    <option

                        key={member.id}

                        value={member.id}

                    >

                        {member.fullName}

                    </option>

                ))

            }

        </select>

    );

}