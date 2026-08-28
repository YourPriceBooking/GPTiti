"use client";

import AppShell from "../_home/AppShell";
import ProjectsView from "../_home/ProjectsView";

export default function ProjectsPage() {
  return (
    <AppShell requireAuth>{(ctrl) => <ProjectsView ctrl={ctrl} />}</AppShell>
  );
}
