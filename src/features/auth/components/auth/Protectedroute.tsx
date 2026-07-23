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

    // 2. Redirect to landing/login if authentication fails
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    // 3. Optional: Un-comment this to protect roles once loading is finished
    // if (user && !roles.includes(user.role)) {
    //   router.replace("/unauthorized"); // Make sure you have a 403 page
    // }
  }, [loading, isAuthenticated, user, roles, router]);

  // Render a clean loading screen while we determine auth state
  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}