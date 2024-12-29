"use client";

import {
  ArchiveRestoreIcon,
  EditIcon,
  FolderIcon,
  MoreVerticalIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Project } from "@/db/schema";
import {
  useAddProjectToSidebarMutation,
  useDeleteProjectMutation,
  useMoveProjectToTrashMutation,
  useRemoveProjectFromSidebarMutation,
  useRestoreProjectFromTrashMutation,
} from "@/hooks/project-mutations";
import { cn, getProjectUrl } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

import { useRenameProjectModal } from "./modals/rename-project-modal";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function ProjectCard({
  project: initProject,
}: {
  project: Project;
}) {
  const { workspace } = useWorkspace();
  const { data: project } = trpc.projects.getProject.useQuery(
    { projectId: initProject.id, workspaceId: workspace.id },
    {
      initialData: initProject,
      placeholderData: (data) => {
        return data ?? initProject;
      },
    },
  );

  return (
    <div
      className={cn(
        "group relative flex h-14 items-center gap-4 rounded-xl border px-2 transition-shadow hover:shadow-lg dark:hover:bg-secondary/50",
      )}
    >
      <Link
        href={getProjectUrl(project, workspace.slug)}
        className="absolute inset-0 z-10 rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <FolderIcon className="ml-2 h-6 w-6" />
      <p className="flex-1 truncate font-semibold">{project.name}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="z-10 h-8 w-8 group-hover:border"
          >
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <FolderActionDropdownContent project={project} />
      </DropdownMenu>
    </div>
  );
}

function FolderActionDropdownContent({ project }: { project: Project }) {
  const [RenameModal, , setRenameModalOpen] = useRenameProjectModal();

  const moveToTrashMut = useMoveProjectToTrashMutation();
  const restoreFromTrashMut = useRestoreProjectFromTrashMutation();
  const deleteProjectMut = useDeleteProjectMutation();
  const addProjectToSidebarMut = useAddProjectToSidebarMutation();
  const removeProjectFromSidebarMut = useRemoveProjectFromSidebarMutation();

  const disabled =
    moveToTrashMut.isPending ||
    restoreFromTrashMut.isPending ||
    deleteProjectMut.isPending ||
    addProjectToSidebarMut.isPending ||
    removeProjectFromSidebarMut.isPending;

  return (
    <>
      <DropdownMenuContent>
        {project.trashedAt ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                restoreFromTrashMut.mutate({
                  projectId: project.id,
                  workspaceId: project.workspaceId,
                })
              }
              disabled={disabled}
            >
              <ArchiveRestoreIcon />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                deleteProjectMut.mutate({
                  projectId: project.id,
                  workspaceId: project.workspaceId,
                })
              }
              disabled={disabled}
            >
              <TrashIcon />
              Permanently Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => setRenameModalOpen(true)}
              disabled={disabled}
            >
              <EditIcon />
              Rename
            </DropdownMenuItem>
            {project.starredAt ? (
              <DropdownMenuItem
                onClick={() =>
                  removeProjectFromSidebarMut.mutate({
                    projectId: project.id,
                    workspaceId: project.workspaceId,
                  })
                }
                disabled={disabled}
              >
                <StarOffIcon />
                Remove from Sidebar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() =>
                  addProjectToSidebarMut.mutate({
                    projectId: project.id,
                    workspaceId: project.workspaceId,
                  })
                }
                disabled={disabled}
              >
                <StarIcon />
                Add to Sidebar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                moveToTrashMut.mutate({
                  projectId: project.id,
                  workspaceId: project.workspaceId,
                })
              }
              disabled={disabled}
            >
              <TrashIcon />
              Move to Trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      <RenameModal project={project} />
    </>
  );
}
