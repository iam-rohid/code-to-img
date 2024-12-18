"use client";

import {
  EditIcon,
  FolderIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Folder } from "@/db/schema";
import { useWorkspace } from "@/providers/workspace-provider";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function FolderCard({ folder }: { folder: Folder }) {
  const { workspace } = useWorkspace();

  return (
    <div className="group relative flex h-14 items-center gap-4 rounded-xl border px-2 transition-shadow hover:shadow-lg dark:hover:bg-secondary/50">
      <Link
        href={`/${workspace.slug}/folders/${folder.id}`}
        className="absolute inset-0 z-10 rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <FolderIcon className="ml-2 h-6 w-6" />
      <p className="flex-1 truncate font-semibold">{folder.name}</p>

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
        <FolderActionDropdownContent folder={folder} />
      </DropdownMenu>
    </div>
  );
}

function FolderActionDropdownContent({ folder }: { folder: Folder }) {
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
