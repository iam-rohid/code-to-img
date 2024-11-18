import publicProcedure from "../procedures/public";
import { router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
});
