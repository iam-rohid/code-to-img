import { z } from "zod";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";
import { unstable_cache } from "next/cache";
import { TRPCError } from "@trpc/server";
import { snippetTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getWorkspaceById } from "./workspaces";
import { db } from "@/db";

export const getSnippet = unstable_cache(
  async (snippetId: string, userId: string) => {
    const [snippet] = await db
      .select()
      .from(snippetTable)
      .where(eq(snippetTable.id, snippetId));
    if (!snippet) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found!" });
    }

    await getWorkspaceById(snippet.workspaceId, userId);
    return snippet;
  },
  ["snippet"],
);

export const snippetsRouter = router({
  getSnippet: protectedProcedure
    .input(z.object({ snippetId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getSnippet(input.snippetId, ctx.session.user.id);
    }),
  getSnippets: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const snippets = await db
        .select()
        .from(snippetTable)
        .where(eq(snippetTable.workspaceId, workspace.id))
        .orderBy(desc(snippetTable.createdAt));
      return snippets;
    }),
  createSnippet: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        dto: z.object({
          title: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );
      const [snippet] = await ctx.db
        .insert(snippetTable)
        .values({
          workspaceId: workspace.id,
          title: input.dto.title,
        })
        .returning();
      if (!snippet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return snippet;
    }),
});
