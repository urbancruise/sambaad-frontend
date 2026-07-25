"use client";

import TabButton from "./TabButton";

export type ProfileTab =

    | "overview"

    | "goals"

    | "tasks"

    | "activities"

    | "timeline"

    | "performance";

interface Props {

    value: ProfileTab;

    onChange: (

        value: ProfileTab

    ) => void;

}

const tabs: {

    label: string;

    value: ProfileTab;

}[] = [

    {

        label: "Overview",

        value: "overview"

    },

    {

        label: "Goals",

        value: "goals"

    },

    {

        label: "Tasks",

        value: "tasks"

    },

    {

        label: "Activities",

        value: "activities"

    },

    {

        label: "Timeline",

        value: "timeline"

    },

    {

        label: "Performance",

        value: "performance"

    }

];

export default function ProfileTabs({

    value,

    onChange

}: Props) {

    return (

        <div className="flex flex-wrap gap-3">

            {

                tabs.map(tab => (

                    <TabButton

                        key={tab.value}

                        label={tab.label}

                        active={

                            value === tab.value

                        }

                        onClick={()=>

                            onChange(

                                tab.value

                            )

                        }

                    />

                ))

            }

        </div>

    );

}