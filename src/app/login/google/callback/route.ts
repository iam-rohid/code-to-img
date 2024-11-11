import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { google } from "@/auth/providers";
import {
  createSession,
  createUserAndAccount,
  generateSessionToken,
  getUserAccount,
  setSessionTokenCookie,
} from "@/auth/utils";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();

  const storedState = cookieStore.get("google_oauth_state")?.value;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value;

  if (!code || !state || !storedState || !codeVerifier) {
    return new NextResponse(null, { status: 400 });
  }
  if (state !== storedState) {
    return new NextResponse(null, { status: 400 });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse(null, { status: 400 });
  }
  const googleUser = decodeIdToken(tokens.idToken()) as {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string | null;
  };

  const existingAccount = await getUserAccount("google", googleUser.sub);

  if (existingAccount !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingAccount.userId);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const { user } = await createUserAndAccount({
    provider: "google",
    providerAccountId: googleUser.sub,
    raw: googleUser,
    userInfo: {
      email: googleUser.email,
      image: googleUser.picture,
      name: googleUser.name,
      emailVerified: googleUser.email_verified,
    },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return NextResponse.redirect(new URL("/", request.url), 302);
}
