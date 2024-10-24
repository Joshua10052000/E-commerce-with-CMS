import { router } from "../lib/trpc.js";
import authRouter from "./auth.js";

type AppRouter = typeof appRouter;

const appRouter = router({
  auth: authRouter,
});

export type { AppRouter };
export default appRouter;
