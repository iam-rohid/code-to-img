import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { z } from "zod";

import { projectTable, snippetTable } from "@/db/schema";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

export const starsRouter = router({
  getAllStars: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      await getWorkspaceById(input.workspaceId, ctx.session.user.id);

      const snippets = ctx.db
        .select({
          type: sql`'snippet'`.as("type"),
          id: snippetTable.id,
          name: snippetTable.title,
          starredAt: snippetTable.starredAt,
          trashedAt: snippetTable.trashedAt,
          workspaceId: snippetTable.workspaceId,
          projectId: snippetTable.projectId,
        })
        .from(snippetTable);

      const projects = ctx.db
        .select({
          type: sql`'project'`.as("type"),
          id: projectTable.id,
          name: projectTable.name,
          starredAt: projectTable.starredAt,
          trashedAt: projectTable.trashedAt,
          workspaceId: projectTable.workspaceId,
          projectId: sql`NULL`.as("project_id"),
        })
        .from(projectTable);

      const starsTable = unionAll(projects, snippets).as("stars");

      const stars = await ctx.db
        .select()
        .from(starsTable)
        .where(
          and(
            eq(starsTable.workspaceId, input.workspaceId),
            isNotNull(starsTable.starredAt),
            isNull(starsTable.trashedAt),
          ),
        )
        .orderBy(desc(starsTable.starredAt));

      return stars.map((item) => ({
        ...item,
        projectId: item.projectId as string | null,
        starredAt: item.starredAt as Date,
        type: item.type as "snippet" | "project",
      }));
    }),
});
