import { github } from "@/auth/providers";
import {
  createSession,
  createUserAndAccount,
  generateSessionToken,
  getUserAccount,
  setSessionTokenCookie,
} from "@/auth/utils";
import { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value;

  if (!code || !state || !storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  if (githubUserResponse.status !== 200) {
    return new Response(githubUserResponse.statusText, { status: 400 });
  }

  const githubUser = (await githubUserResponse.json()) as {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    email: string | null;
  };

  const existingUser = await getUserAccount("github", String(githubUser.id));

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.userId);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  if (!githubUser.email) {
    return new Response("Email not found!", { status: 404 });
  }

  const { user } = await createUserAndAccount({
    provider: "github",
    providerAccountId: String(githubUser.id),
    raw: githubUser,
    userInfo: {
      email: githubUser.email,
      image: githubUser.avatar_url,
      name: githubUser.name,
      emailVerified: true,
    },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return NextResponse.redirect(new URL("/", request.url), 302);
}
