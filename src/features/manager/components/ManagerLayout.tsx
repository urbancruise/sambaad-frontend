"use client";

import React from "react";

import Navbar, {WorkspaceItem } from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";
import { Calendar as CalendarIcon, Star  } from "lucide-react";

import {
    LayoutDashboard,
    Users,
    Target,
    ClipboardList,
    BarChart3,
    Bell,
    CheckSquare,
    Layers,
    MessageSquare,
    Mail
} from "lucide-react";

const managerSidebarItems: SidebarItemData[] = [
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
    url: `/manager/team`,
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
    url: `/manager/email`,
    color: 'yellow'
  },
];

const managerWorkspaceItems: WorkspaceItem[] = [
  {
    label: "Goals",
    url: "/manager/goals",
    icon: Target,
    desc: "Track company-wide objectives & key results"
  },
  {
    label: "Tasks",
    url: "/manager/tasks",
    icon: ClipboardList,
    desc: "Oversee project deliverables & assignments"
  },
  {
    label: "Activities",
    url: "/manager/activities",
    icon: Bell,
    desc: "Monitor system logs & audit trails"
  },
  {
    label: "Performance",
    url: "/manager/performance",
    icon: BarChart3,
    desc: "Analyze company performance metrics"
  },
];

const navItems = [

    {
        label: "Dashboard",
        icon: LayoutDashboard,
        url: "/manager/dashboard"
    },

    {
        label: "TeamLeads",
        icon: Users,
        url: "/manager/team"
    },
        { 
            label: "Calendar", 
            icon: CalendarIcon, 
            url: "/manager/calendar" 
        },


    {
        label: "Ratings",
        icon: Star,
        url: "/manager/rating"
    },

];

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen overflow-hidden">

            <Navbar navItems={navItems} workspaceItems={managerWorkspaceItems}  />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar items={managerSidebarItems} />

                <main className="flex-1 overflow-y-auto">

                    <div className="max-w-full mx-auto ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}
