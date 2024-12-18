import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { projectTable } from "@/db/schema";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

const getProject = async (projectId: string, userId: string) => {
  const [project] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))
    .limit(1);

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found!",
    });
  }

  await getWorkspaceById(project.workspaceId, userId);

  return project;
};

export const projectsRouter = router({
  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getProject(input.projectId, ctx.session.user.id);
    }),
  getAllProjects: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const projects = await db
        .select()
        .from(projectTable)
        .where(
          and(
            eq(projectTable.workspaceId, workspace.id),
            isNull(projectTable.trashedAt),
          ),
        )
        .orderBy(desc(projectTable.createdAt));

      return projects;
    }),
  getTrashedProjects: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const projects = await db
        .select()
        .from(projectTable)
        .where(
          and(
            eq(projectTable.workspaceId, workspace.id),
            isNotNull(projectTable.trashedAt),
          ),
        )
        .orderBy(desc(projectTable.createdAt));

      return projects;
    }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }).max(100),
        workspaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const [project] = await db
        .insert(projectTable)
        .values({
          name: input.name,
          workspaceId: workspace.id,
        })
        .returning();

      if (!project) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return project;
    }),
  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        dto: z
          .object({
            name: z.string(),
          })
          .partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, ctx.session.user.id);
      const [updatedProject] = await db
        .update(projectTable)
        .set({ name: input.dto.name })
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!updatedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedProject;
    }),
  moveToTrash: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, ctx.session.user.id);
      const [updatedProject] = await ctx.db
        .update(projectTable)
        .set({ trashedAt: new Date() })
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!updatedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedProject;
    }),
  restoreFromTrash: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, ctx.session.user.id);
      const [updatedProject] = await ctx.db
        .update(projectTable)
        .set({ trashedAt: null })
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!updatedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedProject;
    }),
  deleteProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, ctx.session.user.id);
      const [deletedProject] = await ctx.db
        .delete(projectTable)
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!deletedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return deletedProject;
    }),
});
