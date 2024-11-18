"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CURRENT_WORKSPACE_SLUG_COOKIE, SESSION_COOKIE } from "@/lib/constants";

import { getCurrentSession, invalidateSession } from "./utils";

export async function signOut() {
  const session = await getCurrentSession();
  if (!session) {
    return;
  }

  await invalidateSession(session.session.token);
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(CURRENT_WORKSPACE_SLUG_COOKIE);
  return redirect("/login");
}
