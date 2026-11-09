"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/auth/selectors";
import { selectSelectedModel } from "@/redux/model/selectors";
import {
  attachLibraryFiles,
  getLibraryTarget,
  readLibraryDraft,
  subscribeLibraryDraft,
  emptyLibraryDraft,
} from "@/lib/files/libraryDraft";
import { LIBRARY_ENABLED, libraryInput } from "@/lib/files/library";
import { useSyncExternalStore } from "react";
import AppShell from "../_home/AppShell";
import LibraryBrowser from "@/components/Files/LibraryBrowser";
import styles from "@/components/Files/Library.module.css";
function FilesContent() {
  const router = useRouter();
  const owner = useAppSelector(selectUser)?.id;
  const model = useAppSelector(selectSelectedModel);
  const path = getLibraryTarget(owner);
  const draft = useSyncExternalStore(
    subscribeLibraryDraft,
    () => readLibraryDraft(owner, path),
    emptyLibraryDraft,
  );
  if (!LIBRARY_ENABLED)
    return <p className={styles.disabledPage}>Files is not enabled yet.</p>;
  if (!owner)
    return <p className={styles.disabledPage}>Sign in to open your files.</p>;
  return (
    <LibraryBrowser
      key={owner}
      owner={owner}
      modelId={model}
      currentIds={draft.files.map((f) => f.fileId)}
      current={[
        ...draft.files.map(libraryInput),
        ...draft.local.images.map((f) => f.file),
        ...draft.local.files.map((f) => f.file),
      ]}
      addLabel={path === "/" ? "Add to chat draft" : "Add to current chat"}
      onAdd={(files) => {
        attachLibraryFiles(owner, path, files);
        router.push(path);
      }}
    />
  );
}
export default function FilesPage() {
  return (
    <AppShell requireAuth libraryLayout>
      {() => <FilesContent />}
    </AppShell>
  );
}
