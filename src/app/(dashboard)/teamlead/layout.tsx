"use client";

import React from "react";
import Navbar, { WorkspaceItem, NavItem } from "@/src/components/layout/NavBar";
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
    url: `/teamlead/email`,
    color: 'yellow'
  },
];

// ── Workspace Dropdown Items ──
export const workspaceSubItems: WorkspaceItem[] = [
  { 
    label: 'Goals',       
    url: '/teamlead/goals',       
    icon: Target,        
    desc: 'Track team objectives & key results' 
  },
  { 
    label: 'Tasks',       
    url: '/teamlead/tasks',       
    icon: ClipboardList, 
    desc: 'Manage active deliverables' 
  },
  { 
    label: 'Activities',  
    url: '/teamlead/activities',  
    icon: Bell,          
    desc: 'Real-time team logs & updates' 
  },
  { 
    label: 'Performance', 
    url: '/teamlead/performance', 
    icon: BarChart3,     
    desc: 'Analytics and productivity metrics' 
  },
];

// ── Standard Navbar Items ──
const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    url: "/teamlead/dashboard"
  },
  {
    label: "Employees",
    icon: Users,
    url: "/teamlead/team"
  },
  { 
    label: "Calendar", 
    icon: CalendarIcon, 
    url: "/teamlead/calendar" 
  },
  {
    label: "Ratings",
    icon: Star,
    url: "/teamlead/rating"
  },
];

export default function TeamLeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Pass both standard items and workspace items to Navbar */}
      <Navbar navItems={navItems} workspaceItems={workspaceSubItems} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={teamLeadSidebarItems} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[100%] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}