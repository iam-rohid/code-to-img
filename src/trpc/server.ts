import "server-only"; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { createCallerFactory } from "./trpc";
import { appRouter } from "./router";
import { createContext } from "./context";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
