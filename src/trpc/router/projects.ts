import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { projectTable } from "@/db/schema";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

export const projectsRouter = router({
  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [project] = await db
        .select()
        .from(projectTable)
        .where(eq(projectTable.id, input.projectId))
        .limit(1);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found!",
        });
      }

      await getWorkspaceById(project.workspaceId, ctx.session.user.id);

      return project;
    }),
  getProjects: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const projects = await db
        .select()
        .from(projectTable)
        .where(eq(projectTable.workspaceId, workspace.id))
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
});
