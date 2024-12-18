import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { folderTable } from "@/db/schema";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

import { getWorkspaceById } from "./workspaces";

export const foldersRouter = router({
  getFolder: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [folder] = await db
        .select()
        .from(folderTable)
        .where(eq(folderTable.id, input.folderId))
        .limit(1);

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found!",
        });
      }

      const { workspace } = await getWorkspaceById(
        folder.workspaceId,
        ctx.session.user.id,
      );

      let parentFolders: { id: string; name: string }[] = [];

      let parentId = folder.parentId;

      while (parentId) {
        const [parentFolder] = await db
          .select({
            id: folderTable.id,
            name: folderTable.name,
            parentId: folderTable.parentId,
          })
          .from(folderTable)
          .where(
            and(
              eq(folderTable.id, parentId),
              eq(folderTable.workspaceId, workspace.id),
            ),
          );
        if (!parentFolder) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
        parentFolders = [parentFolder, ...parentFolders];
        parentId = parentFolder.parentId;
      }

      return { ...folder, parentFolders };
    }),
  getFolders: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        parentId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      const folders = await db
        .select()
        .from(folderTable)
        .where(
          and(
            eq(folderTable.workspaceId, workspace.id),
            ...(input.parentId
              ? [eq(folderTable.parentId, input.parentId)]
              : [isNull(folderTable.parentId)]),
          ),
        )
        .orderBy(desc(folderTable.createdAt));

      return folders;
    }),
  createFolder: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }).max(100),
        parentId: z.string().nullish(),
        workspaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspace } = await getWorkspaceById(
        input.workspaceId,
        ctx.session.user.id,
      );

      if (input.parentId) {
        const [parentFolder] = await db
          .select({ id: folderTable.id })
          .from(folderTable)
          .where(
            and(
              eq(folderTable.id, input.parentId),
              eq(folderTable.workspaceId, workspace.id),
            ),
          );
        if (!parentFolder) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent folder not found!",
          });
        }
      }

      const [folder] = await db
        .insert(folderTable)
        .values({
          name: input.name,
          parentId: input.parentId,
          workspaceId: input.workspaceId,
        })
        .returning();

      if (!folder) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return folder;
    }),
});
