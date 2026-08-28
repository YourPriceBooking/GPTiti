"use client";

import { useRouter } from "next/navigation";

import ProjectsOverview from "@/components/HomePage/RightSide/ProjectsOverview/ProjectsOverview";
import { setIsCreateProjectModalOpen } from "@/redux/ui/slice";

import type { HomeController } from "./useHomeController";
import styles from "../page.module.css";

export default function ProjectsView({ ctrl }: { ctrl: HomeController }) {
  const router = useRouter();
  const { dispatch } = ctrl;

  return (
    <div className={styles.projectsOverviewViewport}>
      <ProjectsOverview
        projects={ctrl.projectList}
        onCreateProject={() => dispatch(setIsCreateProjectModalOpen(true))}
        onOpenProject={(projectId) => router.push(`/projects/${projectId}`)}
        onRenameProject={ctrl.handleRenameProject}
        onDeleteProject={ctrl.handleDeleteProject}
        onAddChats={ctrl.handleAddChatsToProject}
      />
    </div>
  );
}
