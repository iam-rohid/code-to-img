import { withAuth } from "../midlewares/with-auth";
import { procedure } from "../trpc";

const protectedProcedure = procedure.use(withAuth);

export default protectedProcedure;
