import { TRPCError } from "@trpc/server";
import { Context } from "./context";
import { workspaceMemberTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function hasAccessToWorkspace(ctx: Context, workspaceId: string) {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [workspaceMember] = await ctx.db
    .select()
    .from(workspaceMemberTable)
    .where(
      and(
        eq(workspaceMemberTable.workspaceId, workspaceId),
        eq(workspaceMemberTable.userId, ctx.session.user.id),
      ),
    );

  if (!workspaceMember) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return workspaceMember;
}
