"use client";

import React from "react";
import Navbar, { NavItem, WorkspaceItem } from "@/src/components/layout/NavBar";
import Sidebar, { SidebarItemData } from "@/src/components/layout/Sidebar";
import {
  LayoutDashboard,
  Building2,
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
    icon: Building2,
    url: `#`,
    color: 'purple'
  },
  {
    label: 'Email',
    subLabel: 'Outbox & Sync',
    icon: Mail,
    url: `/admin/email`,
    color: 'yellow'
  },
];

// ── Admin Workspace Dropdown Items ──
const adminWorkspaceItems: WorkspaceItem[] = [
  {
    label: "Goals",
    url: "/admin/goals",
    icon: Target,
    desc: "Track company-wide objectives & key results"
  },
  {
    label: "Tasks",
    url: "/admin/tasks",
    icon: ClipboardList,
    desc: "Oversee project deliverables & assignments"
  },
  {
    label: "Activities",
    url: "/admin/activities",
    icon: Bell,
    desc: "Monitor system logs & audit trails"
  },
  {
    label: "Performance",
    url: "/admin/performance",
    icon: BarChart3,
    desc: "Analyze company performance metrics"
  },
];

// ── Core Admin Top Nav Items ──
const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin/dashboard"
  },
  {
    label: "Organization",
    icon: Building2,
    url: "/admin/team"
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
      {/* Dynamic Navbar with Admin Nav & Workspace items */}
      <Navbar navItems={adminNavItems} workspaceItems={adminWorkspaceItems} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={adminSidebarItems} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[100%] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}