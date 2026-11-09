"use client";
import { useLayoutEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/auth/selectors";
import { accountPreparation } from "@/lib/files/preparation";
import { LIBRARY_ENABLED } from "@/lib/files/library";
import { setLibraryOwner } from "@/lib/files/libraryDraft";
export default function LibrarySession() {
  const owner = useAppSelector(selectUser)?.id;
  useLayoutEffect(() => {
    if (LIBRARY_ENABLED) {
      setLibraryOwner(owner);
      accountPreparation(owner);
    }
  }, [owner]);
  return null;
}
