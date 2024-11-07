import {
  accountTable,
  Session,
  sessionTable,
  User,
  userTable,
} from "@/db/schema";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const value: typeof sessionTable.$inferInsert = {
    token: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  const [session] = await db.insert(sessionTable).values(value).returning();
  if (!session) {
    throw new Error("Failed to create session");
  }
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.token, sessionId));
  if (result.length < 1) {
    return null;
  }
  const { user, session } = result[0]!;
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.token, session.token));
    return null;
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.token, session.token));
  }
  return { session, user };
}

export async function invalidateSession(token: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.token, token));
}

export async function getUserAccount(
  provider: string,
  providerAccountId: string
) {
  const [account] = await db
    .select()
    .from(accountTable)
    .where(
      and(
        eq(accountTable.provider, provider),
        eq(accountTable.providerAccountId, providerAccountId)
      )
    );
  return account ?? null;
}

export async function createUserAndAccount({
  provider,
  providerAccountId,
  userInfo,
  raw,
}: {
  provider: string;
  providerAccountId: string;
  userInfo: {
    email: string;
    emailVerified?: boolean;
    name: string | null;
    image: string | null;
  };
  raw: unknown;
}) {
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, userInfo.email));
  let user = existingUser;
  if (user) {
    const updateValue: Partial<typeof userTable.$inferInsert> = {};
    if (!user.name && userInfo.name) {
      updateValue.name = userInfo.name;
    }
    if (!user.emailVerified && userInfo.emailVerified) {
      updateValue.emailVerified = new Date();
    }
    if (!user.image && userInfo.image) {
      updateValue.image = userInfo.image;
    }
    if (JSON.stringify(updateValue) !== "{}") {
      const [updatedUser] = await db
        .update(userTable)
        .set(updateValue)
        .where(eq(userTable.id, user.id))
        .returning();
      if (!updatedUser) {
        throw new Error("Failed to update user");
      }
      user = updatedUser;
    }
  } else {
    const [newUser] = await db
      .insert(userTable)
      .values({
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.image,
        emailVerified: userInfo.emailVerified ? new Date() : null,
      })
      .returning();
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    user = newUser;
  }

  const [account] = await db
    .insert(accountTable)
    .values({
      provider,
      providerAccountId,
      raw,
      userId: user.id,
    })
    .returning();
  if (!account) {
    throw new Error("Failed to create account");
  }
  return { account, user };
}

export type SessionValidationResult = { session: Session; user: User };

export async function getCurrentSession(): Promise<SessionValidationResult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return null;
  }
  const result = await validateSessionToken(token);
  return result;
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
