import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "@/auth/providers";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  const cookieStore = await cookies();
  cookieStore.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return NextResponse.redirect(url, 302);
}
