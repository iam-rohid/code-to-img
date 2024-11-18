import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  workspaceMemberTable as workspaceMemberTable,
  workspaceTable as workspaceTable,
} from "@/db/schema";
import { createWorkspaceDto, updateWorkspaceDto } from "@/validators";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const [row] = await db
    .select()
    .from(workspaceMemberTable)
    .innerJoin(
      workspaceTable,
      eq(workspaceTable.id, workspaceMemberTable.workspaceId),
    )
    .where(
      and(
        eq(workspaceMemberTable.workspaceId, workspaceId),
        eq(workspaceMemberTable.userId, userId),
      ),
    );
  if (!row) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Workspace not found!",
    });
  }
  return { workspace: row.workspace, member: row.workspace_member };
};

export const workspacesRouter = router({
  getWorkspaceBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getWorkspaceBySlug", input);
      const [workspace] = await ctx.db
        .select()
        .from(workspaceTable)
        .where(eq(workspaceTable.slug, input.slug));

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found!",
        });
      }

      const [workspaceMember] = await ctx.db
        .select()
        .from(workspaceMemberTable)
        .where(
          and(
            eq(workspaceMemberTable.workspaceId, workspace.id),
            eq(workspaceMemberTable.userId, ctx.session.user.id),
          ),
        );

      if (!workspaceMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this workspace!",
        });
      }

      return { workspace, workspaceMember: workspaceMember };
    }),
  getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const workspaces = await ctx.db
      .select()
      .from(workspaceMemberTable)
      .innerJoin(
        workspaceTable,
        eq(workspaceTable.id, workspaceMemberTable.workspaceId),
      )
      .where(eq(workspaceMemberTable.userId, ctx.session.user.id))
      .orderBy(desc(workspaceMemberTable.createdAt));
    return workspaces;
  }),
  createWorkspace: protectedProcedure
    .input(createWorkspaceDto)
    .mutation(async ({ ctx, input }) => {
      const [workspaceExist] = await ctx.db
        .select()
        .from(workspaceTable)
        .where(eq(workspaceTable.slug, input.slug));
      if (workspaceExist) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `The slug "${input.slug}" is already in use.`,
        });
      }

      const [workspace] = await ctx.db
        .insert(workspaceTable)
        .values({
          name: input.name,
          slug: input.slug,
        })
        .returning();
      if (!workspace) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      await ctx.db.insert(workspaceMemberTable).values({
        workspaceId: workspace.id,
        role: "owner",
        userId: ctx.session.user.id,
      });
      return workspace;
    }),
  updateWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        dto: updateWorkspaceDto,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      if (input.dto.slug) {
        const [existingOrg] = await ctx.db
          .select({ id: workspaceTable.id })
          .from(workspaceTable)
          .where(eq(workspaceTable.slug, input.dto.slug));
        if (existingOrg) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `The slug "${input.dto.slug}" is already in use.`,
          });
        }
      }

      const [updatedWorkspace] = await ctx.db
        .update(workspaceTable)
        .set({
          name: input.dto.name,
          slug: input.dto.slug,
        })
        .where(eq(workspaceTable.id, workspace.id))
        .returning();

      if (!updatedWorkspace) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return updatedWorkspace;
    }),
});
