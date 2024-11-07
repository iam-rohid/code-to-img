import { createContext } from "../context";
import { createCallerFactory, router } from "../trpc";
import { usersRouter } from "./users";
import { workspacesRouter } from "./workspaces";

export const appRouter = router({
  users: usersRouter,
  workspaces: workspacesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};
