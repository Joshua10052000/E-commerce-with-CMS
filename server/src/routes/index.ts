import { procedure, router } from "../lib/trpc.js";
import authRouter from "./auth.js";
import userRouter from "./user.js";

type AppRouter = typeof appRouter;

const appRouter = router({
  auth: authRouter,
  user: userRouter,
  greet: procedure.query(({ ctx }) => {
    return "Hello, World!";
  }),
});

export type { AppRouter };
export default appRouter;
