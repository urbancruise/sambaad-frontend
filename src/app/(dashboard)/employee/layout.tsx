'use client'

import React from 'react';
import Navbar from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";
import { LayoutDashboard,Layers,CheckSquare, MessageSquare,Mail, Users, Settings, Star, Calendar as CalendarIcon } from "lucide-react";

const customTeamLinks = [
  { label: "Goal", icon: LayoutDashboard, url: "/employee/goals" },
  { label: "Task", icon: Users, url: "/employee/tasks" },
  { label: "Activity", icon: Settings, url: "/employee/activities" },
  { label: "Rating", icon: Star, url: "/employee/rating" },
  { label: "Calendar", icon: CalendarIcon, url: "/employee/calendar" },
];

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
    url: `/employee/dashboard`,
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
    url: `/employee/email`,
    color: 'yellow'
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-0 h-screen overflow-hidden">
      <Navbar navItems={customTeamLinks} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={teamLeadSidebarItems} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[95%] mt-3 w-[95%] px-1 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  ); 
}
