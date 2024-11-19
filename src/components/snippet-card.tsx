import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArchiveRestoreIcon,
  ClipboardIcon,
  CopyIcon,
  EditIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Snippet } from "@/db/schema";
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

dayjs.extend(relativeTime);

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [RenameModal, , setRenameModalOpen] = useRenameSnippetModal();
  const editorHref = useMemo(
    () => `/editor?snippetId=${encodeURIComponent(snippet.id)}`,
    [snippet.id],
  );

  const utils = trpc.useUtils();

  const duplicateSnippetMut = trpc.snippets.duplicateSnippet.useMutation({
    onSuccess: () => {
      utils.snippets.getSnippets.invalidate();
      toast.success("Snippet duplicated");
    },
    onError: (error) => {
      toast.error("Failed to duplicate snippet", {
        description: error.message,
      });
    },
  });

  const moveToTrashMut = trpc.snippets.moveToTrash.useMutation({
    onSuccess: () => {
      utils.snippets.getSnippets.invalidate();
      toast.success("Snippet moved to trash");
    },
    onError: (error) => {
      toast.error("Failed to move snippet to trash", {
        description: error.message,
      });
    },
  });

  const restoreFromTrashMut = trpc.snippets.restoreFromTrash.useMutation({
    onSuccess: () => {
      utils.snippets.getSnippets.invalidate();
      toast.success("Snippet restored from trash");
    },
    onError: (error) => {
      toast.error("Failed to restore snippet from trash", {
        description: error.message,
      });
    },
  });

  const deleteSnippetMut = trpc.snippets.deleteSnippet.useMutation({
    onSuccess: () => {
      utils.snippets.getSnippets.invalidate();
      toast.success("Snippet permanently deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete snippet", {
        description: error.message,
      });
    },
  });

  const handlCopyLink = useCallback(() => {
    const url = new URL(`/view/${snippet.id}`, window.location.href);
    window.navigator.clipboard.writeText(url.toString());
    toast.success("Link copied to clipboard");
  }, [snippet.id]);

  return (
    <div className="group relative rounded-xl border transition-shadow hover:shadow-lg">
      <Link
        href={editorHref}
        className="absolute inset-0 z-10 rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="p-2 pb-0">
        <SnippetViewer
          data={snippet.data}
          className="aspect-[3/2] overflow-hidden rounded-lg bg-secondary"
        />
      </div>

      <div className="flex items-center gap-2 py-2 pl-4 pr-2">
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-semibold">{snippet.title}</p>
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
                  onClick={() =>
                    deleteSnippetMut.mutate({ snippetId: snippet.id })
                  }
                >
                  <TrashIcon />
                  Permanently Delete
                </DropdownMenuItem>
              </>
            ) : (
              <>
                {/* <DropdownMenuItem onClick={() => router.push(editorHref)}>
                  <ExternalLinkIcon />
                  Open
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={handlCopyLink}>
                  <ClipboardIcon />
                  Copy Link
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <ShareIcon />
                  Share
                </DropdownMenuItem> */}
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
                  onClick={() =>
                    moveToTrashMut.mutate({ snippetId: snippet.id })
                  }
                >
                  <TrashIcon />
                  Move to Trash
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <RenameModal
          snippet={snippet}
          onRenamed={() => {
            utils.snippets.getSnippets.invalidate({
              trashed: false,
              workspaceId: snippet.workspaceId,
            });
          }}
        />
      </div>
    </div>
  );
}
