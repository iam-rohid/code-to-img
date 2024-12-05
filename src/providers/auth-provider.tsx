"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

import { signOut } from "@/auth/actions";
import { SessionValidationResult } from "@/auth/utils";
import { trpc } from "@/trpc/client";

type Loading = {
  status: "loading";
  session: undefined;
};
type Authorized = {
  status: "authorized";
  session: SessionValidationResult;
};
type Unauthorized = {
  status: "unauthorized";
  session: null;
  error?: string | null;
};

type SessionState = Authorized | Loading | Unauthorized;

export type AuthContextValue = SessionState & {
  signOut: () => Promise<void>;
};

const Context = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  session,
  children,
}: {
  session?: SessionValidationResult | null;
  children: ReactNode;
}) {
  const sessionQuery = trpc.auth.getSession.useQuery(undefined, {
    initialData: session,
  });

  const router = useRouter();
  const handleSignOut = useCallback(async () => {
    posthog.reset();
    await signOut();
    localStorage.clear();
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (sessionQuery.isSuccess && sessionQuery.data) {
      posthog.identify(sessionQuery.data?.user.id, {
        email: sessionQuery.data?.user.email,
      });
    }
  }, [sessionQuery.data, sessionQuery.isSuccess]);

  return (
    <Context.Provider
      value={{
        ...(sessionQuery.isLoading
          ? { status: "loading", session: undefined }
          : sessionQuery.isError || !sessionQuery.data
            ? {
                status: "unauthorized",
                session: null,
                error: sessionQuery.error?.message,
              }
            : { status: "authorized", session: sessionQuery.data }),
        signOut: handleSignOut,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAuth must use inside AuthProvider");
  }
  return context;
};
