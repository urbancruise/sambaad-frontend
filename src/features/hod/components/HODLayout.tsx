"use client";

import React from "react";
import Navbar, { NavItem, WorkspaceItem } from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";
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
  Mail,
  Calendar as CalendarIcon
} from "lucide-react";

// ── Sidebar Navigation Items ──
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
    url: `hod/email`,
    color: 'yellow'
  },
];

// ── HOD / Manager Workspace Dropdown Items ──
const hodWorkspaceItems: WorkspaceItem[] = [
  {
    label: "Goals",
    url: "/hod/goals",
    icon: Target,
    desc: "Track department objectives & key results"
  },
  {
    label: "Tasks",
    url: "/hod/tasks",
    icon: ClipboardList,
    desc: "Manage active deliverables and assignments"
  },
  {
    label: "Activities",
    url: "/hod/activities",
    icon: Bell,
    desc: "Real-time department updates & audit logs"
  },
  {
    label: "Performance",
    url: "/hod/performance",
    icon: BarChart3,
    desc: "Analytics & team productivity metrics"
  },
];

// ── Core HOD Top Nav Items ──
const hodNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    url: "/hod/dashboard"
  },
  {
    label: "Team Leads",
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
      {/* Navbar with HOD-specific Nav & Workspace items */}
      <Navbar navItems={hodNavItems} workspaceItems={hodWorkspaceItems} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={hodSidebarItems} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[100%] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}