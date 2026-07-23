"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth);
};