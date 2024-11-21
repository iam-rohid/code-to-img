import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Snippet } from "@/db/schema";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export const useSnippetActions = (snippet: Snippet) => {
  const utils = trpc.useUtils();
  const { workspace } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  const editingSnippet = pathname.startsWith(
    `/${workspace.slug}/editor/${snippet.id}`,
  );

  const moveToTrashMut = trpc.snippets.moveToTrash.useMutation({
    onMutate: (vars) => {
      utils.snippets.getSnippets.setData(
        { workspaceId: workspace.id, trashed: false },
        (snippets) =>
          snippets?.filter((snippet) => snippet.id !== vars.snippetId),
      );
      utils.snippets.getSnippets.setData(
        { workspaceId: workspace.id, trashed: true },
        (snippets) => [
          ...(snippets ?? []),
          { ...snippet, trashedAt: new Date() },
        ],
      );
      utils.snippets.getSnippet.setData(
        { snippetId: snippet.id },
        { ...snippet, trashedAt: new Date() },
      );

      if (editingSnippet) {
        const snippets = utils.snippets.getSnippets.getData({
          workspaceId: workspace.id,
          trashed: false,
        });
        const newSnippet = snippets?.filter(
          (snippet) => snippet.id !== vars.snippetId,
        )[0];
        if (newSnippet) {
          router.push(`/${workspace.slug}/editor/${newSnippet.id}`);
        } else {
          router.push(`/${workspace.slug}`);
        }
      }
    },
    onSuccess: () => {
      toast.success("Snippet moved to trash");
    },
    onError: (error) => {
      utils.snippets.getSnippets.invalidate();
      utils.snippets.getSnippet.invalidate({ snippetId: snippet.id });
      toast.error("Failed to move snippet to trash", {
        description: error.message,
      });
    },
  });

  const restoreFromTrashMut = trpc.snippets.restoreFromTrash.useMutation({
    onMutate: (vars) => {
      utils.snippets.getSnippets.setData(
        { workspaceId: workspace.id, trashed: true },
        (snippets) =>
          snippets?.filter((snippet) => snippet.id !== vars.snippetId),
      );
      utils.snippets.getSnippets.setData(
        { workspaceId: workspace.id, trashed: false },
        (snippets) => [...(snippets ?? []), { ...snippet, trashedAt: null }],
      );
      utils.snippets.getSnippet.setData(
        { snippetId: snippet.id },
        { ...snippet, trashedAt: null },
      );
    },
    onSuccess: () => {
      toast.success("Snippet restored from trash");
    },
    onError: (error) => {
      utils.snippets.getSnippets.invalidate();
      utils.snippets.getSnippet.invalidate({ snippetId: snippet.id });
      toast.error("Failed to restore snippet from trash", {
        description: error.message,
      });
    },
  });

  const deleteSnippetMut = trpc.snippets.deleteSnippet.useMutation({
    onMutate: (vars) => {
      utils.snippets.getSnippets.setData(
        { workspaceId: workspace.id, trashed: true },
        (snippets) =>
          snippets?.filter((snippet) => snippet.id !== vars.snippetId),
      );

      if (editingSnippet) {
        const snippets = utils.snippets.getSnippets.getData({
          workspaceId: workspace.id,
          trashed: false,
        });
        const newSnippet = snippets?.filter(
          (snippet) => snippet.id !== vars.snippetId,
        )[0];
        if (newSnippet) {
          router.push(`/${workspace.slug}/editor/${newSnippet.id}`);
        } else {
          router.push(`/${workspace.slug}`);
        }
      }
    },
    onSuccess: () => {
      toast.success("Snippet permanently deleted");
    },
    onError: (error) => {
      utils.snippets.getSnippets.invalidate();
      utils.snippets.getSnippet.invalidate({ snippetId: snippet.id });
      toast.error("Failed to delete snippet", {
        description: error.message,
      });
    },
  });

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

  return {
    deleteSnippetMut,
    restoreFromTrashMut,
    moveToTrashMut,
    duplicateSnippetMut,
  };
};
