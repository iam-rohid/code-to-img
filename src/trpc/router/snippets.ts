import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { projectTable, Snippet, snippetTable } from "@/db/schema";
import { DEFAULT_SNIPPET_TEMPLATE } from "@/lib/constants/templates";
import { snippetSchema } from "@/lib/validator/snippet";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

const parseSnippet = (snippet: Snippet): Snippet => {
  try {
    const data = snippetSchema.parse(snippet.data);
    return {
      ...snippet,
      data,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ...snippet,
      data: DEFAULT_SNIPPET_TEMPLATE.data,
    };
  }
};

export const getSnippet = async (snippetId: string, userId: string) => {
  const [snippet] = await db
    .select()
    .from(snippetTable)
    .where(eq(snippetTable.id, snippetId));
  if (!snippet) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found!" });
  }

  await getWorkspaceById(snippet.workspaceId, userId);
  return parseSnippet(snippet);
};

export const snippetsRouter = router({
  getSnippet: protectedProcedure
    .input(z.object({ snippetId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getSnippet(input.snippetId, ctx.session.user.id);
    }),
  getSnippets: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        trashed: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const snippets = await db
        .select()
        .from(snippetTable)
        .where(
          and(
            eq(snippetTable.workspaceId, workspace.id),
            ...(input.projectId
              ? [eq(snippetTable.projectId, input.projectId)]
              : [isNull(snippetTable.projectId)]),
            ...(input.trashed
              ? [isNotNull(snippetTable.trashedAt)]
              : [isNull(snippetTable.trashedAt)]),
          ),
        )
        .orderBy(desc(snippetTable.createdAt));
      return snippets.map(parseSnippet);
    }),
  getRecentSnippets: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const snippets = await db
        .select()
        .from(snippetTable)
        .where(
          and(
            eq(snippetTable.workspaceId, workspace.id),
            isNull(snippetTable.trashedAt),
          ),
        )
        .orderBy(desc(snippetTable.lastSeenAt), desc(snippetTable.createdAt));
      return snippets.map(parseSnippet);
    }),
  createSnippet: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        dto: z.object({
          title: z.string(),
          data: snippetSchema.optional(),
          projectId: z.string().nullish(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );
      if (input.dto.projectId) {
        const [project] = await db
          .select({ id: projectTable.id })
          .from(projectTable)
          .where(
            and(
              eq(projectTable.id, input.dto.projectId),
              eq(projectTable.workspaceId, workspace.id),
            ),
          );
        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found!",
          });
        }
      }

      const [snippet] = await ctx.db
        .insert(snippetTable)
        .values({
          workspaceId: workspace.id,
          title: input.dto.title,
          data: input.dto.data,
          projectId: input.dto.projectId,
        })
        .returning();
      if (!snippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return snippet;
    }),
  updateSnippet: protectedProcedure
    .input(
      z.object({
        snippetId: z.string(),
        dto: z.object({
          title: z.string().optional(),
          data: snippetSchema.optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const snippet = await getSnippet(input.snippetId, ctx.session.user.id);
      const [updatedSnippet] = await ctx.db
        .update(snippetTable)
        .set({
          title: input.dto.title,
          data: input.dto.data,
          lastSeenAt: new Date(),
        })
        .where(eq(snippetTable.id, snippet.id))
        .returning();
      if (!updatedSnippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedSnippet;
    }),
  duplicateSnippet: protectedProcedure
    .input(z.object({ snippetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const snippet = await getSnippet(input.snippetId, ctx.session.user.id);
      const [duplicatedSnippet] = await ctx.db
        .insert(snippetTable)
        .values({
          title: `${snippet.title} (Copy)`,
          workspaceId: snippet.workspaceId,
          data: snippet.data,
        })
        .returning();
      if (!duplicatedSnippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return duplicatedSnippet;
    }),
  moveToTrash: protectedProcedure
    .input(z.object({ snippetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const snippet = await getSnippet(input.snippetId, ctx.session.user.id);
      const [updateedSnippet] = await ctx.db
        .update(snippetTable)
        .set({ trashedAt: new Date() })
        .where(eq(snippetTable.id, snippet.id))
        .returning();
      if (!updateedSnippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updateedSnippet;
    }),
  restoreFromTrash: protectedProcedure
    .input(z.object({ snippetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const snippet = await getSnippet(input.snippetId, ctx.session.user.id);
      const [updateedSnippet] = await ctx.db
        .update(snippetTable)
        .set({ trashedAt: null })
        .where(eq(snippetTable.id, snippet.id))
        .returning();
      if (!updateedSnippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updateedSnippet;
    }),
  deleteSnippet: protectedProcedure
    .input(
      z.object({
        snippetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const snippet = await getSnippet(input.snippetId, ctx.session.user.id);
      const [deletedSnippet] = await ctx.db
        .delete(snippetTable)
        .where(eq(snippetTable.id, snippet.id))
        .returning();
      if (!deletedSnippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return deletedSnippet;
    }),
});
