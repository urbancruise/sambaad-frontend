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

  const isAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const profile = await getProfile();

        const user = profile?.data?.user ?? profile?.data ?? profile;

        dispatch(loginSuccess({ user }));
      } catch {
        if (!isAuthRef.current) {
          dispatch(logout());
        }
      }
    };

    initialize();
  }, [dispatch]);

  return null;
}