import { getCurrentSession } from "@/auth/utils";
import { db } from "@/db";

export const createContext = async () => {
  const session = await getCurrentSession();
  const ctx = {
    session,
    db,
  };

  return ctx;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
