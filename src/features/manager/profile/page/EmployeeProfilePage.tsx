"use client";

import EmployeeProfilePage from "@/src/features/employee-profile/page/EmployeeProfilePage";

// Thin wrapper — keeps the old import path working so your route files
// don't change. All logic lives in src/features/employee-profile.
export default function ManagerEmployeeProfilePage() {
    return <EmployeeProfilePage role="manager" />;
}
