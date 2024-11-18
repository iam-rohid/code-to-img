import { NextRequest, NextResponse } from "next/server";

import { getCurrentSession } from "@/auth/utils";
import { getFirstWorkspaceSlug } from "@/lib/server/getters";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), 302);
  }

  const workspaceSlug = await getFirstWorkspaceSlug(session);

  if (workspaceSlug) {
    return NextResponse.redirect(new URL(`/${workspaceSlug}`, req.url), 302);
  }

  return NextResponse.redirect(new URL(`/onboarding/workspace`, req.url), 302);
}
