"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LoadingScreen from "./loadingScreenDenied"; // Ensure path is correct

type Props = {
  children: React.ReactNode;
  roles: string[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // 1. SAFETY: Do nothing while the auth state is still initializing/loading
    if (loading) return;

    if (user && !roles.includes(user.role)) {
      router.replace("/unauthorized"); // Make sure you have a 403 page
    }
  }, [loading, user, roles, router]);

  // Render a clean loading screen while we determine auth state
  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
