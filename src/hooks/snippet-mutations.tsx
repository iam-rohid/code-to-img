import { toast } from "sonner";

import { Snippet } from "@/db/schema";
import { iSnippetData } from "@/lib/validator/snippet";
import { trpc } from "@/trpc/client";

export const useMoveSnippetToTrashMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.moveToTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Moving snippet to trash...");

      const snippet = utils.snippets.getSnippet.getData(vars);

      utils.snippets.getSnippets.setData(
        { workspaceId: vars.workspaceId, projectId: snippet?.projectId },
        (snippets) => snippets?.filter((item) => item.id !== vars.snippetId),
      );
      utils.snippets.getRecentSnippets.setData(
        { workspaceId: vars.workspaceId },
        (snippets) => snippets?.filter((item) => item.id !== vars.snippetId),
      );
      if (snippet) {
        const newSnippet: Snippet = { ...snippet, trashedAt: new Date() };
        utils.snippets.getTrashedSnippets.setData(
          { workspaceId: vars.workspaceId },
          (snippets) => (snippets ? [newSnippet, ...snippets] : undefined),
        );
        utils.snippets.getSnippet.setData(vars, newSnippet);

        if (snippet.starredAt) {
          utils.stars.getAllStars.setData(
            { workspaceId: vars.workspaceId },
            (snippets) =>
              snippets?.filter((item) => item.id !== vars.snippetId),
          );
        }
      }

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
    onSettled: (data, _error, vars) => {
      utils.snippets.getSnippets.invalidate({
        workspaceId: vars.workspaceId,
        projectId: data?.projectId,
      });
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippet.invalidate(vars);

      if (data?.starredAt) {
        utils.stars.getAllStars.invalidate({
          workspaceId: vars.workspaceId,
        });
      }
    },
  });
};

export const useRestoreSnippetFromTrashMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.restoreFromTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Restoring snippet from trash...");

      const snippet = utils.snippets.getSnippet.getData(vars);

      if (snippet) {
        const newSnippet: Snippet = { ...snippet, trashedAt: null };
        utils.snippets.getSnippets.setData(
          { workspaceId: vars.workspaceId, projectId: snippet.projectId },
          (snippets) => (snippets ? [newSnippet, ...snippets] : undefined),
        );
        utils.snippets.getRecentSnippets.setData(
          { workspaceId: vars.workspaceId },
          (snippets) => (snippets ? [newSnippet, ...snippets] : undefined),
        );
        utils.snippets.getSnippet.setData(vars, newSnippet);
      }

      utils.snippets.getTrashedSnippets.setData(
        { workspaceId: vars.workspaceId },
        (snippets) => snippets?.filter((item) => item.id !== vars.snippetId),
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
    onSettled: (data, _error, vars) => {
      utils.snippets.getSnippet.invalidate(vars);
      utils.snippets.getSnippets.invalidate({
        workspaceId: vars.workspaceId,
        projectId: data?.projectId,
      });
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });

      if (data?.starredAt) {
        utils.stars.getAllStars.invalidate({ workspaceId: vars.workspaceId });
      }
    },
  });
};

export const useDeleteSnippetMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.deleteSnippet.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Permanently deleting snippet...");
      utils.snippets.getTrashedSnippets.setData(
        { workspaceId: vars.workspaceId },
        (snippets) => snippets?.filter((item) => item.id !== vars.snippetId),
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
    onSettled: (_data, _error, vars) => {
      utils.snippets.getTrashedSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
    },
  });
};

export const useDuplicateSnippetMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.duplicateSnippet.useMutation({
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
    onSettled: (data, _error, vars) => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: vars.workspaceId,
        projectId: data?.projectId,
      });
    },
  });
};

export const useAddSnippetToSidebarMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.starSnippet.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Adding snippet to your sidebar...");

      const snippet = utils.snippets.getSnippet.getData(vars);
      if (snippet) {
        utils.stars.getAllStars.setData(
          { workspaceId: vars.workspaceId },
          (stars) =>
            stars
              ? [
                  {
                    type: "snippet",
                    id: snippet.id,
                    name: snippet.title,
                    starredAt: new Date(),
                    trashedAt: snippet.trashedAt,
                    workspaceId: snippet.workspaceId,
                    projectId: snippet.projectId,
                  },
                  ...stars,
                ]
              : undefined,
        );
        utils.snippets.getSnippet.setData(vars, {
          ...snippet,
          starredAt: new Date(),
        });
      }
      utils.snippets.getSnippets.setData(
        { workspaceId: vars.workspaceId, projectId: snippet?.projectId },
        (snippets) =>
          snippets?.map((snippet) =>
            snippet.id === vars.snippetId
              ? {
                  ...snippet,
                  starredAt: new Date(),
                }
              : snippet,
          ),
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Added snippet to your sidebar", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to add snippet to your sidebar", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (data, _error, vars) => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: vars.workspaceId,
        projectId: data?.projectId,
      });
      utils.stars.getAllStars.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippet.invalidate(vars);
    },
  });
};

export const useRemoveSnippetFromSidebarMutation = () => {
  const utils = trpc.useUtils();
  return trpc.snippets.unstarSnippet.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Removing snippet from your sidebar...");

      utils.stars.getAllStars.setData(
        { workspaceId: vars.workspaceId },
        (stars) =>
          stars
            ? stars.filter((item) => item.id !== vars.snippetId)
            : undefined,
      );
      utils.snippets.getSnippet.setData(vars, (snippet) =>
        snippet ? { ...snippet, starredAt: null } : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Removed snippet from your sidebar", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to remove snippet from your sidebar", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (_data, _error, vars) => {
      utils.snippets.getRecentSnippets.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippets.invalidate({
        workspaceId: vars.workspaceId,
        projectId: _data?.projectId,
      });
      utils.stars.getAllStars.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.snippets.getSnippet.invalidate(vars);
    },
  });
};

export const useUpdateSnippetMutation = () => {
  const utils = trpc.useUtils();

  return trpc.snippets.updateSnippet.useMutation({
    onMutate: ({ dto, snippetId, workspaceId }) => {
      utils.snippets.getSnippet.setData(
        { snippetId, workspaceId },
        (snippet) =>
          snippet
            ? {
                ...snippet,
                ...dto,
                data: (dto.data as iSnippetData | undefined) ?? snippet.data,
              }
            : undefined,
      );
      const toastId = toast.loading("Renaming snippet");
      return { toastId };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Snippet renamed", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to rename snippet", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled(data, _error, { snippetId, workspaceId }) {
      utils.snippets.getRecentSnippets.invalidate({ workspaceId });
      utils.snippets.getSnippets.invalidate({
        workspaceId,
        projectId: data?.projectId,
      });
      utils.snippets.getSnippet.invalidate({ snippetId, workspaceId });
    },
  });
};
