"use server";

import { redirect } from "next/navigation";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "./utils";

export async function signOut() {
  const session = await getCurrentSession();
  if (!session) {
    return;
  }

  await invalidateSession(session.session.token);
  await deleteSessionTokenCookie();
  return redirect("/login");
}
