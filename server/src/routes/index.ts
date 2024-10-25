import { procedure, router } from "../lib/trpc.js";
import authRouter from "./auth.js";

type AppRouter = typeof appRouter;

const appRouter = router({
  auth: authRouter,
  greet: procedure.query(({ ctx }) => {
    console.log(ctx.req.sessionID);
    return "Hello, World!";
  }),
});

export type { AppRouter };
export default appRouter;
