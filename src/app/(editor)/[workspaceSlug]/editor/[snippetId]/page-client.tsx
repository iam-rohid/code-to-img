"use client";

import dayjs from "dayjs";
import { ArchiveRestoreIcon, Loader2Icon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";

import Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Snippet } from "@/db/schema";
import { useSnippetActions } from "@/hooks/use-snippet-actions";
import { CloudSnippetDataProvider } from "@/providers/snippet-data-provider";
import SnippetProvider from "@/providers/snippet-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const { snippetId } = useParams<{
    snippetId: string;
  }>();
  const snippetQuery = trpc.snippets.getSnippet.useQuery({ snippetId });

  if (snippetQuery.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (snippetQuery.isError) {
    return <p>{snippetQuery.error.message}</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      {snippetQuery.data.trashedAt && (
        <SnippetTrashedBanner snippet={snippetQuery.data} />
      )}
      <SnippetProvider snippet={snippetQuery.data}>
        <CloudSnippetDataProvider snippet={snippetQuery.data}>
          <Editor />
        </CloudSnippetDataProvider>
      </SnippetProvider>
    </div>
  );
}

function SnippetTrashedBanner({ snippet }: { snippet: Snippet }) {
  const { deleteSnippetMut, restoreFromTrashMut } = useSnippetActions(snippet);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 bg-destructive px-4 py-2 text-destructive-foreground">
      <p className="font-mediumd text-center">
        This snippet has been moved to trash{" "}
        {dayjs(snippet.trashedAt).fromNow()}. It will autometically be deleted
        in {dayjs(snippet.trashedAt).add(30, "d").diff(new Date(), "d")} days.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-destructive-foreground bg-transparent text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground"
          onClick={() => restoreFromTrashMut.mutate({ snippetId: snippet.id })}
        >
          <ArchiveRestoreIcon />
          Restore Snippet
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-destructive-foreground bg-transparent text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground"
          onClick={() => deleteSnippetMut.mutate({ snippetId: snippet.id })}
        >
          <TrashIcon />
          Delete from Trash
        </Button>
      </div>
    </div>
  );
}
