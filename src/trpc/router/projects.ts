import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { projectTable } from "@/db/schema";
import { Context } from "../context";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

const getProject = async (
  projectId: string,
  workspaceId: string,
  ctx: Context,
) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const workspace = await getWorkspaceById(workspaceId, ctx.session.user.id);

  const [project] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))
    .limit(1);

  if (!project || project.workspaceId !== workspace.workspace.id) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found!",
    });
  }

  return project;
};

export const projectsRouter = router({
  getProject: protectedProcedure
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .query(async ({ ctx, input }) =>
      getProject(input.projectId, input.workspaceId, ctx),
    ),
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
        workspaceId: z.string(),
        dto: z
          .object({
            name: z.string(),
          })
          .partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

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
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

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
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

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
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

      const [deletedProject] = await ctx.db
        .delete(projectTable)
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!deletedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return deletedProject;
    }),
  starProject: protectedProcedure
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

      const [updatedProject] = await ctx.db
        .update(projectTable)
        .set({ starredAt: new Date() })
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!updatedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedProject;
    }),
  unstarProject: protectedProcedure
    .input(z.object({ projectId: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProject(input.projectId, input.workspaceId, ctx);

      const [updatedProject] = await ctx.db
        .update(projectTable)
        .set({ starredAt: null })
        .where(eq(projectTable.id, project.id))
        .returning();
      if (!updatedProject) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedProject;
    }),
});
