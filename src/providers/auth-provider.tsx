"use client";

import { signOut } from "@/auth/actions";
import { SessionValidationResult } from "@/auth/utils";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext } from "react";

export type AuthContextValue = {
  session: SessionValidationResult | null;
  signOut: () => Promise<void>;
};

const Context = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  session,
  children,
}: {
  session: SessionValidationResult | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const handleSignOut = useCallback(async () => {
    await signOut();
    localStorage.clear();
    router.refresh();
  }, [router]);

  return (
    <Context.Provider value={{ session, signOut: handleSignOut }}>
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
