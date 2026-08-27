"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/auth/selectors";

import {
  QUICK_TASKS_ALLOWED_EMAILS,
  isEmailAllowed,
} from "@/config/featureAccess.config";

export function useQuickTasksAccess(): boolean {
  const user = useAppSelector(selectUser);
  return isEmailAllowed(QUICK_TASKS_ALLOWED_EMAILS, user?.email);
}
