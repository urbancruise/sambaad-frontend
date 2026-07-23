'use client'
import React from 'react';
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/src/features/auth/components/auth/Protectedroute";

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let roles: string[] = [];

  if (pathname.startsWith("/tasks/admin")) {
    roles = ["ADMIN"];
  }

  else if (pathname.startsWith("/tasks/manager")) {
    roles = ["MANAGER"];
  }

  else if (pathname.startsWith("/teamlead")) {
    roles = ["TEAM_LEAD"];
  }

  else if (pathname.startsWith("/employee")) {
    roles = ["EMPLOYEE"];
  }
  
  return (

     <ProtectedRoute roles={roles}>
      {children}
    </ProtectedRoute>
  );
}