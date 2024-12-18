"use client";

import {
  EditIcon,
  FolderIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Project } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { trpc } from "@/trpc/client";

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

function FolderActionDropdownContent({}: { project: Project }) {
  // const [RenameModal, , setRenameModalOpen] = useRenameSnippetModal();

  // const {
  //   deleteSnippetMut,
  //   moveToTrashMut,
  //   restoreFromTrashMut,
  //   duplicateSnippetMut,
  // } = useSnippetActions(folder);

  return (
    <>
      <DropdownMenuContent>
        {/* {folder.trashedAt ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                restoreFromTrashMut.mutate({ snippetId: folder.id })
              }
            >
              <ArchiveRestoreIcon />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteSnippetMut.mutate({ snippetId: folder.id })}
            >
              <TrashIcon />
              Permanently Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            </>
            )} */}
        <DropdownMenuItem>
          <EditIcon />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <RenameModal snippet={folder} /> */}
    </>
  );
}
