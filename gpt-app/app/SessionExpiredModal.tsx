"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSessionExpired } from "@/redux/auth/selectors";
import { clearSessionExpired } from "@/redux/auth/slice";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";

export default function SessionExpiredModal() {
  const dispatch = useAppDispatch();
  const sessionExpired = useAppSelector(selectSessionExpired);

  if (!sessionExpired) return null;

  return <LoginModal open onClose={() => dispatch(clearSessionExpired())} />;
}
