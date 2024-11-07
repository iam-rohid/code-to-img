import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext,
  });

  return response;
};

export { handler as GET, handler as POST };
