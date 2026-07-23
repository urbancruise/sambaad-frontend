"use client";

interface Props {

    value: string;

    onChange: (value: string) => void;

}

const priorities = [

    "LOW",

    "MEDIUM",

    "HIGH",

    "CRITICAL"

];

export default function PrioritySelect({

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

                priorities.map(priority => (

                    <option

                        key={priority}

                        value={priority}

                    >

                        {priority}

                    </option>

                ))

            }

        </select>

    );

}