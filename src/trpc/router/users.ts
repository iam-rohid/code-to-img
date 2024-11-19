import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { userTable } from "@/db/schema";
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
});
