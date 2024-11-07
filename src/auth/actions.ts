"use server";

import { deleteWorkspaceSlugFromCookie } from "@/server/actions";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "./utils";
import { redirect } from "next/navigation";

export async function signOut() {
  const session = await getCurrentSession();
  if (!session) {
    return;
  }

  await invalidateSession(session.session.token);
  await deleteSessionTokenCookie();
  await deleteWorkspaceSlugFromCookie();
  return redirect("/login");
}
