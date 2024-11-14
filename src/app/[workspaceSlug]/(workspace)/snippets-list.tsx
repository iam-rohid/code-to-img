"use client";

import { useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ChevronDownIcon,
  CopyIcon,
  EditIcon,
  FilterIcon,
  Loader2,
  MoreVertical,
  Plus,
  SearchIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SnippetViewer from "@/components/snippet-viewer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
dayjs.extend(relativeTime);

export default function SnippetsList() {
  const { workspace } = useWorkspace();
  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
  });

  const router = useRouter();

  const utils = trpc.useUtils();
  const createSnippetMut = trpc.snippets.createSnippet.useMutation();

  const handleCreateSnippet = useCallback(() => {
    createSnippetMut.mutate(
      { workspaceId: workspace.id, dto: { title: "Untitled" } },
      {
        onSuccess: (snippet) => {
          toast("Snippet created");
          router.push(`/${workspace.slug}/editor/${snippet.id}`);
          utils.snippets.getSnippets.invalidate({ workspaceId: workspace.id });
        },
        onError: (error) => {
          toast("Failed to create snippet", { description: error.message });
        },
      },
    );
  }, [
    createSnippetMut,
    router,
    utils.snippets.getSnippets,
    workspace.id,
    workspace.slug,
  ]);

  return (
    <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
      <div>
        <h2 className="text-xl font-semibold">My Snippets</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <FilterIcon />
            Filter
            <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <form className="relative w-full max-w-sm">
            <Input className="w-full pl-10 pr-10" placeholder="Search..." />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>
          <Button
            onClick={handleCreateSnippet}
            disabled={createSnippetMut.isPending}
          >
            {createSnippetMut.isPending ? <Loader2 /> : <Plus />}
            Create Snippet
          </Button>
        </div>
      </div>

      <div>
        {snippetsQuery.isPending ? (
          <p>Loading...</p>
        ) : snippetsQuery.isError ? (
          <p>{snippetsQuery.error.message}</p>
        ) : snippetsQuery.data.length < 1 ? (
          <p>No snippets found</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {snippetsQuery.data.map((snippet) => (
              <div
                key={snippet.id}
                className="group relative overflow-hidden rounded-lg border"
              >
                <SnippetViewer
                  data={snippet.data}
                  className="aspect-video bg-secondary"
                />

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
                      <DropdownMenuItem>
                        <ShareIcon />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CopyIcon />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EditIcon />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <TrashIcon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link
                  href={`/${workspace.slug}/editor/${snippet.id}`}
                  className="absolute inset-0 z-0"
                ></Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
