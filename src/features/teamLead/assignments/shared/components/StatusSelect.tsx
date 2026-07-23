"use client";

interface Props {

    value: string;

    onChange: (value: string) => void;

}

const statuses = [

    "PENDING",

    "IN_PROGRESS",

    "COMPLETED"

];

export default function StatusSelect({

    value,

    onChange

}: Props) {

    return (

        <select

            value={value}

            onChange={(e) => onChange(e.target.value)}

            className="w-full rounded-lg border p-3"

        >

            {

                statuses.map(status => (

                    <option

                        key={status}

                        value={status}

                    >

                        {status}

                    </option>

                ))

            }

        </select>

    );

}