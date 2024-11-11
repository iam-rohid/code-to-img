"use server";

import { cookies } from "next/headers";

const WORKSPACE_SLUG_KEY = "workspace-slug";

export async function setWorkspaceSlugInCookie(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set(WORKSPACE_SLUG_KEY, slug, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getWorkspaceSlugFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(WORKSPACE_SLUG_KEY)?.value ?? null;
}

export async function deleteWorkspaceSlugFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.delete(WORKSPACE_SLUG_KEY);
}
