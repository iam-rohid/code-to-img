"use client";

import AppBar from "@/components/app-bar";
import { useCreateProjectModal } from "@/components/modals/create-project-modal";
import { ProjectList, ProjectListSkeleton } from "@/components/project-list";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import { PlusIcon } from "lucide-react";

export default function PageClient() {
  const { workspace } = useWorkspace();
  const projectsQuery = trpc.projects.getProjects.useQuery({
    workspaceId: workspace.id,
  });

  const [CreateProjectModal, , setCreateProjectModalOpen] =
    useCreateProjectModal();

  return (
    <>
      <AppBar
        title="All Projects"
        trailing={
          <Button onClick={() => setCreateProjectModalOpen(true)}>
            <PlusIcon />
            Create Project
          </Button>
        }
      />

      <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
        {projectsQuery.isPending ? (
          <ProjectListSkeleton />
        ) : projectsQuery.isError ? (
          <p>{projectsQuery.error.message}</p>
        ) : projectsQuery.data.length <= 1 ? (
          <div className="rounded-lg border px-6 py-16">
            <div className="container mx-auto flex max-w-screen-sm flex-col items-center">
              <h3 className="text-center text-lg font-semibold">
                No projects yet
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Project help you organize snippets and makes sharing easier.
                Start a new project to share with your teammates.
              </p>
              <Button
                className="mt-6"
                onClick={() => setCreateProjectModalOpen(true)}
              >
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <ProjectList projects={projectsQuery.data} />
        )}
      </div>

      <CreateProjectModal />
    </>
  );
}
