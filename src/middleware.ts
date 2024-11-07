import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const publicPages = ["/", "/login.*", "/legal.*"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const sessionToken = req.cookies.get("session")?.value ?? null;

  const publicPathnameRegex = RegExp(
    `^(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (!sessionToken && !isPublicPage) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url, 302);
  }

  if (req.method === "GET") {
    const response = NextResponse.next();
    if (sessionToken) {
      response.cookies.set("session", sessionToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  const originHeader = req.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = req.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403,
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
