"use client";

import {
  ArchiveRestoreIcon,
  EditIcon,
  FolderIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Project } from "@/db/schema";
import { cn } from "@/lib/utils";
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
    { projectId: initProject.id },
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
        href={`/${workspace.slug}/projects/${project.id}`}
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

  const utils = trpc.useUtils();

  const moveToTrashMut = trpc.projects.moveToTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Moving project to trash...");

      utils.projects.getAllProjects.setData(
        { workspaceId: project.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );
      utils.projects.getTrashedProjects.setData(
        { workspaceId: project.workspaceId },
        (oldData) =>
          oldData
            ? [{ ...project, trashedAt: new Date() }, ...oldData]
            : undefined,
      );
      utils.projects.getProject.setData(
        { projectId: vars.projectId },
        { ...project, trashedAt: new Date() },
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project moved to trash", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to move project to trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.projects.getAllProjects.invalidate({
        workspaceId: project.workspaceId,
      });
      utils.projects.getTrashedProjects.invalidate({
        workspaceId: project.workspaceId,
      });
      utils.projects.getProject.invalidate({ projectId: project.id });
    },
  });

  const restoreFromTrashMut = trpc.projects.restoreFromTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Restoring project from trash...");

      utils.projects.getAllProjects.setData(
        { workspaceId: project.workspaceId },
        (oldData) =>
          oldData ? [{ ...project, trashedAt: null }, ...oldData] : undefined,
      );
      utils.projects.getTrashedProjects.setData(
        { workspaceId: project.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );
      utils.projects.getProject.setData(
        { projectId: vars.projectId },
        { ...project, trashedAt: null },
      );
      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project restored from trash", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to restore project from trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.projects.getAllProjects.invalidate({
        workspaceId: project.workspaceId,
      });
      utils.projects.getTrashedProjects.invalidate({
        workspaceId: project.workspaceId,
      });
      utils.projects.getProject.invalidate({ projectId: project.id });
    },
  });

  const deleteProjectMut = trpc.projects.deleteProject.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Permanently deleting project...");

      utils.projects.getTrashedProjects.setData(
        { workspaceId: project.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project permanently deleted", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to delete project", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.projects.getTrashedProjects.invalidate({
        workspaceId: project.workspaceId,
      });
      utils.projects.getProject.invalidate({
        projectId: project.id,
      });
    },
  });

  return (
    <>
      <DropdownMenuContent>
        {project.trashedAt ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                restoreFromTrashMut.mutate({ projectId: project.id })
              }
            >
              <ArchiveRestoreIcon />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteProjectMut.mutate({ projectId: project.id })}
            >
              <TrashIcon />
              Permanently Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => setRenameModalOpen(true)}>
              <EditIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => moveToTrashMut.mutate({ projectId: project.id })}
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
