import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArchiveRestoreIcon,
  CopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Snippet } from "@/db/schema";
import { useSnippetActions } from "@/hooks/use-snippet-actions";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

import { useRenameSnippetModal } from "./modals/rename-snippet-modal";
import SnippetViewer from "./snippet-viewer";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

dayjs.extend(relativeTime);

export function SnippetCard({ snippet: initSnippet }: { snippet: Snippet }) {
  const { workspace } = useWorkspace();
  const { data: snippet } = trpc.snippets.getSnippet.useQuery(
    { snippetId: initSnippet.id },
    {
      initialData: initSnippet,
      placeholderData: (data) => {
        return data ?? initSnippet;
      },
    },
  );

  return (
    <div className="group relative rounded-xl border transition-shadow hover:shadow-lg">
      {snippet.trashedAt ? (
        <div className="absolute inset-0 z-10 rounded-xl"></div>
      ) : (
        <Link
          href={`/${workspace.slug}/editor/${snippet.id}`}
          className="absolute inset-0 z-10 rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      )}

      <div className="p-2 pb-0">
        <SnippetViewer
          data={snippet.data}
          className="aspect-[3/2] overflow-hidden rounded-lg bg-secondary"
        />
      </div>

      <div className="flex items-center gap-2 py-2 pl-4 pr-2">
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-semibold">
            {snippet.title || "Untitled"}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {dayjs(snippet.createdAt).fromNow()}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="z-10 h-8 w-8 group-hover:border"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <SnippetActionDropdownContent snippet={snippet} />
        </DropdownMenu>
      </div>
    </div>
  );
}

export function SnippetSidebarItem({
  snippet: initSnippet,
  isActive,
}: {
  snippet: Snippet;
  isActive?: boolean;
}) {
  const { workspace } = useWorkspace();
  const { data: snippet } = trpc.snippets.getSnippet.useQuery(
    { snippetId: initSnippet.id },
    {
      initialData: initSnippet,
      placeholderData: (data) => {
        return data ?? initSnippet;
      },
    },
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="h-fit p-0" isActive={isActive}>
        <div>
          <Link
            href={`/${workspace.slug}/editor/${snippet.id}`}
            className="absolute inset-0 z-10 rounded-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />

          <div className="p-2 pr-0">
            <SnippetViewer
              data={snippet.data}
              className="h-16 w-16 overflow-hidden rounded-sm bg-sidebar"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center overflow-hidden p-2">
            <p className="truncate text-sm font-medium">{snippet.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {dayjs(snippet.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            showOnHover
            className="right-2 top-2 z-20 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontalIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <SnippetActionDropdownContent snippet={snippet} />
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function SnippetActionDropdownContent({ snippet }: { snippet: Snippet }) {
  const [RenameModal, , setRenameModalOpen] = useRenameSnippetModal();

  const {
    deleteSnippetMut,
    moveToTrashMut,
    restoreFromTrashMut,
    duplicateSnippetMut,
  } = useSnippetActions(snippet);

  return (
    <>
      <DropdownMenuContent>
        {snippet.trashedAt ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                restoreFromTrashMut.mutate({ snippetId: snippet.id })
              }
            >
              <ArchiveRestoreIcon />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteSnippetMut.mutate({ snippetId: snippet.id })}
            >
              <TrashIcon />
              Permanently Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() =>
                duplicateSnippetMut.mutate({ snippetId: snippet.id })
              }
            >
              <CopyIcon />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRenameModalOpen(true)}>
              <EditIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => moveToTrashMut.mutate({ snippetId: snippet.id })}
            >
              <TrashIcon />
              Move to Trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      <RenameModal snippet={snippet} />
    </>
  );
}
