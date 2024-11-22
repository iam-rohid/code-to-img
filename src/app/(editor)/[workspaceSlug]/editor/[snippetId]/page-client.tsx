"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ArchiveRestoreIcon, Loader2Icon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import SnippetEditor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Snippet } from "@/db/schema";
import { useSnippetActions } from "@/hooks/use-snippet-actions";
import { iSnippetData } from "@/lib/validator/snippet";
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

  return <SnippetLoaded snippet={snippetQuery.data} />;
}

function SnippetLoaded({ snippet }: { snippet: Snippet }) {
  const [newData, setNewData] = useState<iSnippetData | null>(null);
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.snippets.updateSnippet.useMutation({
    onMutate: (vars) => {
      utils.snippets.getSnippet.setData(
        { snippetId: vars.snippetId },
        (snippet) =>
          snippet
            ? {
                ...snippet,
                data: vars.dto.data ?? snippet.data,
                title: vars.dto.title ?? snippet.title,
              }
            : undefined,
      );
    },
    onSuccess: (data) => {
      utils.snippets.getSnippet.setData({ snippetId: snippet.id }, data);
    },
    onError: (error) => {
      toast.error("Failed to save", { description: error.message });
    },
  });

  useEffect(() => {
    if (isPending || !newData) {
      return;
    }

    const timeout = setTimeout(() => {
      mutate({ snippetId: snippet.id, dto: { data: newData } });
      setNewData(null);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isPending, mutate, newData, snippet.id]);

  useEffect(() => {
    if (!newData && !isPending) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPending, newData]);

  return (
    <div className="flex flex-1 flex-col">
      {snippet.trashedAt && <SnippetTrashedBanner snippet={snippet} />}
      <SnippetProvider snippet={snippet}>
        <SnippetEditor
          defaultValue={snippet.data}
          onChnage={setNewData}
          snippetId={snippet.id}
        />
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
