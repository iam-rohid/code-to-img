import { createContext } from "../context";
import { createCallerFactory, router } from "../trpc";

import { authRouter } from "./auth";
import { projectsRouter } from "./projects";
import { snippetsRouter } from "./snippets";
import { starsRouter } from "./stars";
import { usersRouter } from "./users";
import { workspacesRouter } from "./workspaces";

export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  workspaces: workspacesRouter,
  snippets: snippetsRouter,
  projects: projectsRouter,
  stars: starsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};
