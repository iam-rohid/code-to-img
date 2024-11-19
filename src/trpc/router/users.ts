import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

import { userTable, workspaceMemberTable } from "@/db/schema";
import { CURRENT_WORKSPACE_SLUG_COOKIE, SESSION_COOKIE } from "@/lib/constants";
import protectedProcedure from "../procedures/protected";
import { router } from "../trpc";

export const usersRouter = router({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await ctx.db
        .update(userTable)
        .set({ name: input.name, image: input.image })
        .where(eq(userTable.id, ctx.session.user.id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedUser;
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const workspaceMemerships = await ctx.db
      .select()
      .from(workspaceMemberTable)
      .where(eq(workspaceMemberTable.userId, ctx.session.user.id));
    if (workspaceMemerships.find((membership) => membership.role === "owner")) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You are owner of one or more workspaces. Please transfer ownership or delete your workspaces before deleting your account.",
      });
    }
    await ctx.db.delete(userTable).where(eq(userTable.id, ctx.session.user.id));

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(CURRENT_WORKSPACE_SLUG_COOKIE);
  }),
});
