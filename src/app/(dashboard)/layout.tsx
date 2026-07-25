'use client'
import React from 'react';
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/src/features/auth/components/auth/Protectedroute";

const ROUTE_ROLES: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/hod": ["HOD", "ZONAL_HEAD"],
  "/manager": ["MANAGER"],
  "/teamlead": ["TEAM_LEAD"],
  "/employee": ["EMPLOYEE"],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const matchedKey = Object.keys(ROUTE_ROLES).find(prefix => pathname.startsWith(prefix));
  const roles = matchedKey ? ROUTE_ROLES[matchedKey] : [];

  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}