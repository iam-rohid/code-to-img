import { toast } from "sonner";

import { Project } from "@/db/schema";
import { trpc } from "@/trpc/client";

export const useMoveProjectToTrashMutation = () => {
  const utils = trpc.useUtils();

  return trpc.projects.moveToTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Moving project to trash...");

      utils.projects.getAllProjects.setData(
        { workspaceId: vars.workspaceId },
        (projects) => projects?.filter((item) => item.id !== vars.projectId),
      );

      const project = utils.projects.getProject.getData(vars);
      if (project) {
        const newProj: Project = { ...project, trashedAt: new Date() };
        utils.projects.getTrashedProjects.setData(
          { workspaceId: vars.workspaceId },
          (oldData) => (oldData ? [newProj, ...oldData] : undefined),
        );
        utils.projects.getProject.setData(vars, newProj);
        if (project.starredAt) {
          utils.stars.getAllStars.setData(
            { workspaceId: vars.workspaceId },
            (oldData) => oldData?.filter((item) => item.id !== vars.projectId),
          );
        }
      }
      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project moved to trash", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to move project to trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (data, _error, vars) => {
      utils.projects.getProject.invalidate(vars);
      utils.projects.getAllProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.projects.getTrashedProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      if (data?.starredAt) {
        utils.stars.getAllStars.invalidate({
          workspaceId: vars.workspaceId,
        });
      }
    },
  });
};

export const useRestoreProjectFromTrashMutation = () => {
  const utils = trpc.useUtils();

  return trpc.projects.restoreFromTrash.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Restoring project from trash...");

      utils.projects.getTrashedProjects.setData(
        { workspaceId: vars.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );

      const project = utils.projects.getProject.getData(vars);
      if (project) {
        const newProj: Project = { ...project, trashedAt: null };
        utils.projects.getAllProjects.setData(
          { workspaceId: vars.workspaceId },
          (oldData) => (oldData ? [newProj, ...oldData] : undefined),
        );
        utils.projects.getProject.setData(vars, newProj);
      }

      return {
        toastId,
      };
    },
    onSuccess: (data, vars, ctx) => {
      toast.success("Project restored from trash", {
        id: ctx.toastId,
      });
      if (data.starredAt) {
        utils.stars.getAllStars.invalidate({
          workspaceId: vars.workspaceId,
        });
      }
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to restore project from trash", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (data, _error, vars) => {
      utils.projects.getProject.invalidate(vars);
      utils.projects.getAllProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.projects.getTrashedProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      if (data?.starredAt) {
        utils.stars.getAllStars.invalidate({
          workspaceId: vars.workspaceId,
        });
      }
    },
  });
};

export const useDeleteProjectMutation = () => {
  const utils = trpc.useUtils();

  return trpc.projects.deleteProject.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Permanently deleting project...");

      utils.projects.getAllProjects.setData(
        { workspaceId: vars.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );
      utils.projects.getTrashedProjects.setData(
        { workspaceId: vars.workspaceId },
        (oldData) =>
          oldData
            ? oldData.filter((item) => item.id !== vars.projectId)
            : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project permanently deleted", {
        id: ctx.toastId,
      });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to delete project", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (data, _error, vars) => {
      if (data?.trashedAt) {
        utils.projects.getTrashedProjects.invalidate({
          workspaceId: vars.workspaceId,
        });
      } else {
        utils.projects.getAllProjects.invalidate({
          workspaceId: vars.workspaceId,
        });
      }
    },
  });
};

export const useAddProjectToSidebarMutation = () => {
  const utils = trpc.useUtils();

  return trpc.projects.starProject.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Adding project to your sidebar...");

      const project = utils.projects.getProject.getData(vars);

      utils.projects.getAllProjects.setData(
        { workspaceId: vars.workspaceId },
        (projects) =>
          projects?.map((proj) =>
            proj.id === vars.projectId
              ? { ...proj, starredAt: new Date() }
              : proj,
          ),
      );

      if (project) {
        utils.stars.getAllStars.setData(
          { workspaceId: project.workspaceId },
          (stars) =>
            stars
              ? [
                  {
                    type: "project",
                    id: project.id,
                    name: project.name,
                    trashedAt: project.trashedAt,
                    workspaceId: project.workspaceId,
                    projectId: null,
                    starredAt: new Date(),
                  },
                  ...stars,
                ]
              : undefined,
        );
        utils.projects.getProject.setData(vars, {
          ...project,
          starredAt: new Date(),
        });
      }

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Added project to your sidebar", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to add project to your sidebar", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (_data, _error, vars) => {
      utils.projects.getAllProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.stars.getAllStars.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.projects.getProject.invalidate(vars);
    },
  });
};

export const useRemoveProjectFromSidebarMutation = () => {
  const utils = trpc.useUtils();

  return trpc.projects.unstarProject.useMutation({
    onMutate: (vars) => {
      const toastId = toast.loading("Removing project from your sidebar...");

      utils.stars.getAllStars.setData(
        { workspaceId: vars.workspaceId },
        (stars) => stars?.filter((item) => item.id !== vars.projectId),
      );
      utils.projects.getAllProjects.setData(
        { workspaceId: vars.workspaceId },
        (oldData) =>
          oldData?.map((project) =>
            project.id !== vars.projectId
              ? { ...project, starredAt: null }
              : project,
          ),
      );
      utils.projects.getProject.setData(vars, (project) =>
        project ? { ...project, starredAt: null } : undefined,
      );

      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Removed project from your sidebar", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to remove project from your sidebar", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled: (_data, _error, vars) => {
      utils.projects.getAllProjects.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.stars.getAllStars.invalidate({
        workspaceId: vars.workspaceId,
      });
      utils.projects.getProject.invalidate(vars);
    },
  });
};

export const useUpdateProjectMutation = () => {
  const utils = trpc.useUtils();
  return trpc.projects.updateProject.useMutation({
    onMutate: ({ projectId, dto, workspaceId }) => {
      utils.projects.getProject.setData(
        { projectId, workspaceId },
        (project) => (project ? { ...project, ...dto } : undefined),
      );
      utils.projects.getAllProjects.setData({ workspaceId }, (projects) =>
        projects?.map((proj) =>
          proj.id === projectId ? { ...proj, ...dto } : proj,
        ),
      );
      const toastId = toast.loading("Renaming project...");
      return {
        toastId,
      };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Project renamed", { id: ctx.toastId });
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to rename project", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
    onSettled(_data, _error, { projectId, workspaceId }) {
      utils.projects.getAllProjects.invalidate({ workspaceId });
      utils.projects.getProject.invalidate({ projectId, workspaceId });
    },
  });
};
