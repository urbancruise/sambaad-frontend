"use client";

import React from "react";

import Navbar from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";
import { Calendar as CalendarIcon } from "lucide-react";

import {
    LayoutDashboard,
    Users,
    Target,
    ClipboardList,
    BarChart3,
    Star,
    Bell,
    CheckSquare,
    Layers,
    MessageSquare,
    Mail
} from "lucide-react";

const hodSidebarItems: SidebarItemData[] = [
  {
    label: 'Dashboard',
    subLabel: 'Manager Console',
    icon: Layers,
    url: `#`,
    color: 'orange'
  },
  {
    label: 'PMS',
    subLabel: 'Team Management',
    icon: CheckSquare,
    url: `/hod/team`,
    color: 'green'
  },
  {
    label: 'Communication',
    subLabel: 'Chat & Forums',
    icon: MessageSquare,
    url: `#`,
    color: 'blue'
  },
  {
    label: 'Meetings',
    subLabel: 'Room Scheduling',
    icon: Users,
    url: `#`,
    color: 'purple'
  },
  {
    label: 'Email',
    subLabel: 'Outbox & Sync',
    icon: Mail,
    url: `#`,
    color: 'yellow'
  },
];

const navItems = [

    {
        label: "Dashboard",
        icon: LayoutDashboard,
        url: "/hod/dashboard"
    },

    {
        label: "Goals",
        icon: Target,
        url: "/hod/goals"
    },

    {
        label: "Tasks",
        icon: ClipboardList,
        url: "/hod/tasks"
    },

    {
        label: "Activities",
        icon: Bell,
        url: "/hod/activities"
    },

    {
        label: "Performance",
        icon: BarChart3,
        url: "/hod/performance"
    },

    {
        label: "TeamLeads",
        icon: Users,
        url: "/hod/team"
    },
        { 
            label: "Calendar", 
            icon: CalendarIcon, 
            url: "/hod/calendar" 
        },


    {
        label: "Ratings",
        icon: Star,
        url: "/hod/rating"
    },

];

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen overflow-hidden">

            <Navbar navItems={navItems} />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar items={hodSidebarItems} />

                <main className="flex-1 overflow-y-auto">

                    <div className="max-w-[100%] mx-auto ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}
