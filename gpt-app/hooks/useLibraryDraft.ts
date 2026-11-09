"use client";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/auth/selectors";
import {
  readLibraryDraft,
  subscribeLibraryDraft,
  emptyLibraryDraft,
  writeLibraryDraft,
  type LibraryDraft,
} from "@/lib/files/libraryDraft";
export function useLibraryDraft() {
  const owner = useAppSelector(selectUser)?.id;
  const path = usePathname();
  const draft = useSyncExternalStore(
    subscribeLibraryDraft,
    () => readLibraryDraft(owner, path),
    emptyLibraryDraft,
  );
  return {
    owner,
    path,
    draft,
    update: (patch: Partial<LibraryDraft>) =>
      writeLibraryDraft(owner, path, patch),
  };
}
