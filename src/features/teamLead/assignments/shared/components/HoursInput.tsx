"use client";

interface Props {

    value: number | "";

    onChange: (value: number | "") => void;

}

export default function HoursInput({

    value,

    onChange

}: Props) {

    return (

        <input

            type="number"

            min={0}

            value={value}

            placeholder="Estimated Hours"

            className="w-full rounded-lg border p-3"

            onChange={(e) =>

                onChange(

                    e.target.value

                        ? Number(e.target.value)

                        : ""

                )

            }

        />

    );

}