"use client";

import dynamic from "next/dynamic";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSessionExpired } from "@/redux/auth/selectors";
import { clearSessionExpired } from "@/redux/auth/slice";

const LoginModal = dynamic(
  () => import("@/components/HomePage/common/LoginModal/LoginModal"),
  { ssr: false },
);

export default function SessionExpiredModal() {
  const dispatch = useAppDispatch();
  const sessionExpired = useAppSelector(selectSessionExpired);

  if (!sessionExpired) return null;

  return <LoginModal open onClose={() => dispatch(clearSessionExpired())} />;
}
