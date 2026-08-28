"use client";

import { useParams } from "next/navigation";

import AppShell from "../../_home/AppShell";
// import NotFound from "../../_home/NotFound";
import ProjectView from "../../_home/ProjectView";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  // а AppShell повертає користувача на початкову сторінку:
  // {(ctrl) =>
  //   ctrl.activeProject ? (
  //     <ProjectView ctrl={ctrl} />
  //   ) : ctrl.projectsLoaded ? (
  //     <NotFound title="Project not found" />
  //   ) : null
  // }
  return (
    <AppShell projectId={projectId} requireAuth>
      {(ctrl) => <ProjectView ctrl={ctrl} />}
    </AppShell>
  );
}
