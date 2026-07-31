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

const adminSidebarItems: SidebarItemData[] = [
  {
    label: 'Dashboard',
    subLabel: 'Admin Console',
    icon: Layers,
    url: `#`,
    color: 'orange'
  },
  {
    label: 'PMS',
    subLabel: 'Organization',
    icon: CheckSquare,
    url: `/admin/team`,
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
        url: "/admin/dashboard"
    },
    {
        label: "Organization",
        icon: LayoutDashboard,
        url: "/admin/team"
    },

    {
        label: "Goals",
        icon: Target,
        url: "/admin/goals"
    },

    {
        label: "Tasks",
        icon: ClipboardList,
        url: "/admin/tasks"
    },

    {
        label: "Activities",
        icon: Bell,
        url: "/admin/activities"
    },

    {
        label: "Performance",
        icon: BarChart3,
        url: "/admin/performance"
    },


{
    label: "Calendar",
    icon: CalendarIcon,
    url: "/admin/calendar"   
},

    {
        label: "Ratings",
        icon: Star,
        url: "/admin/rating"
    },

];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="flex flex-col h-screen overflow-hidden">

            <Navbar navItems={navItems} />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar items={adminSidebarItems} />

                <main className="flex-1 overflow-y-auto">

                    <div className="max-w-[100%] mx-auto ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}