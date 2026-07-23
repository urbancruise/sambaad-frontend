"use client";

import React from "react";

import Navbar from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";

import {
    LayoutDashboard,
    Users,
    Target,
    ClipboardList,
    BarChart3,
    Award,
    Calendar,
    Bell,
    CheckSquare,
    Layers,
    MessageSquare,
    Mail
} from "lucide-react";

const teamLeadSidebarItems: SidebarItemData[] = [
  { 
    label: 'Dashboard', 
    subLabel: 'TL Console', 
    icon: Layers, 
    url: `#`,
    color: 'orange'
  },
  { 
    label: 'PMS', 
    subLabel: 'Team Management', 
    icon: CheckSquare, 
    url: `/teamlead/dashboard`,
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
        url: "/teamlead/dashboard"
    },

    {
        label: "Goals",
        icon: Target,
        url: "/teamlead/goals"
    },

    {
        label: "Tasks",
        icon: ClipboardList,
        url: "/teamlead/tasks"
    },

    {
        label: "Activities",
        icon: Bell,
        url: "/teamlead/activities"
    },

    {
        label: "Performance",
        icon: BarChart3,
        url: "/teamlead/performance"
    },

    {
        label: "Employees",
        icon: Users,
        url: "/teamlead/team"
    },

    {
        label: "Ratings",
        icon: Calendar,
        url: "/employee/rating"
    },

];

export default function TeamLeadLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen overflow-hidden">

            <Navbar navItems={navItems} />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar items={teamLeadSidebarItems} />

                <main className="flex-1 overflow-y-auto">

                    <div className="max-w-[100%] mx-auto ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}
