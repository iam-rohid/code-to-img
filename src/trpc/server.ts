import "server-only"; // <-- ensure this file cannot be imported from the client

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { createContext } from "./context";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./router";
import { createCallerFactory } from "./trpc";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
