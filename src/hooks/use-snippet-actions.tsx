import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Snippet } from "@/db/schema";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export const useSnippetActions = (snippet: Snippet) => {
  const utils = trpc.useUtils();
  const { workspace } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const { projectId } = useParams<{ projectId?: string }>();

  const editingSnippet = pathname.startsWith(
    `/${workspace.slug}/editor/${snippet.id}`,
  );

  const moveToTrashMut = trpc.snippets.moveToTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Moving snippet to trash...");

      if (editingSnippet) {
        const snippets = utils.snippets.getSnippets.getData({
          workspaceId: workspace.id,
          projectId,
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

      utils.snippets.getSnippets.setData(
        { workspaceId: snippet.workspaceId, projectId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.snippetId)
            : undefined,
      );
      utils.snippets.getRecentSnippets.setData(
        { workspaceId: snippet.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.snippetId)
            : undefined,
      );
      utils.snippets.getTrashedSnippets.setData(
        { workspaceId: snippet.workspaceId },
        (oldData) =>
          oldData
            ? [{ ...snippet, trashedAt: new Date() }, ...oldData]
            : undefined,
      );
      utils.snippets.getSnippet.setData(
        { snippetId: vars.snippetId },
        (oldData) =>
          oldData ? { ...oldData, trashedAt: new Date() } : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Snippet moved to trash", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to move snippet to trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: snippet.workspaceId,
        projectId,
      });
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippet.invalidate({
        snippetId: snippet.id,
      });
    },
  });

  const restoreFromTrashMut = trpc.snippets.restoreFromTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Restoring snippet from trash...");

      utils.snippets.getSnippets.setData(
        { workspaceId: snippet.workspaceId, projectId },
        (oldData) =>
          oldData ? [{ ...snippet, trashedAt: null }, ...oldData] : undefined,
      );
      utils.snippets.getRecentSnippets.setData(
        { workspaceId: snippet.workspaceId },
        (oldData) =>
          oldData ? [{ ...snippet, trashedAt: null }, ...oldData] : undefined,
      );
      utils.snippets.getTrashedSnippets.setData(
        { workspaceId: snippet.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.snippetId)
            : undefined,
      );
      utils.snippets.getSnippet.setData({ snippetId: snippet.id }, (oldData) =>
        oldData ? { ...oldData, trashedAt: null } : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Snippet restored from trash", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to restore snippet from trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: snippet.workspaceId,
        projectId,
      });
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippet.invalidate({
        snippetId: snippet.id,
      });
    },
  });

  const deleteSnippetMut = trpc.snippets.deleteSnippet.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Permanently deleting snippet...");
      utils.snippets.getTrashedSnippets.setData(
        { workspaceId: snippet.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.snippetId)
            : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Snippet permanently deleted", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to delete snippet", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippet.invalidate({
        snippetId: snippet.id,
      });
    },
  });

  const duplicateSnippetMut = trpc.snippets.duplicateSnippet.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Duplicating snippet...");
      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Snippet duplicated", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to duplicate snippet", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: () => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: snippet.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: snippet.workspaceId,
        projectId,
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
