"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/lib/store";

import {
  loginSuccess,
  logout,
} from "@/src/features/auth/slices/authSlice";

import { getProfile } from "@/src/features/auth/services/auth.service";

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Mirrors isAuthenticated into a ref so the async initialize() below can
  // read the LATEST value at the moment it resolves, not the value that
  // was current when the effect first ran (a plain closure would be stale).
  const isAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getProfile();
        dispatch(loginSuccess({ user }));
      } catch {
        // This request started on page load, before any login attempt.
        // If an explicit login has ALREADY authenticated us by the time
        // this (now-stale) request fails, don't stomp on that session —
        // just drop this result on the floor.
        if (!isAuthRef.current) {
          dispatch(logout());
        }
      }
    };

    initialize();
  }, [dispatch]);

  return null;
}
