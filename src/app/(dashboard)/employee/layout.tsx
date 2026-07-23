'use client'
import React from 'react';
import Sidebar from '@/src/components/layout/Sidebar';
import Navbar from '@/src/components/layout/NavBar';
import { LayoutDashboard, Users, Settings, Star } from "lucide-react";
// import AdvancedLocationFilter from '@/src/components/dashboard/AdvancedLocationFilter';
const customTeamLinks = [
    { label: "Goal", icon: LayoutDashboard, url: "/employee/goals" },
    { label: "Task", icon: Users, url: "/employee/tasks" },
    { label: "Activity", icon: Settings, url: "/employee/activities" },
    { label: "Rating", icon: Star, url: "/employee/rating" },
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
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[90%]  ml-10 mt-5 w-[90%] px-1 mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
); 
}  